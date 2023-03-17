import fs from 'fs'
import {readFile} from 'fs/promises'
import assert from 'assert/strict'

import {sortBy} from 'underscore'
import {DateTime} from 'luxon'

import {tmpInputDir, outputDir} from './constants.js'
import Converter from './converter.js'
import {filterPages} from './wikipediaUtils.js'
import {checkForDuplicates} from './wikidataUtils.js'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {backUpReferenceData} from './utils.js'
import compareData from './csv-comparer.js'
const inputDir = `${tmpInputDir}/coastallandmarks`

const attributionString =
	'Adapted from data from wikipedia licenced under CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0/)'
const columnHeaders = '[Longitude,Latitude,Name,Link,Type,YearBuilt]'

const flatten = arrays => {
	return [].concat.apply([], arrays)
}

function wikify(name) {
	return 'https://en.wikipedia.org/wiki/' + name.replace(/ /g, '_')
}

async function processLighthouses() {
	let resultsAsText = await readFile(`${inputDir}/lighthouses.json`)
	let results = JSON.parse(resultsAsText)
	checkForDuplicates(results)
	let csv = results.map(entry => {
		const qid = entry.item.value
		const name = entry.item.label
		const {lon, lat, wikipediaLink, dateOfOfficialOpening, inception, serviceEntry} = entry
		let date = null
		//we want the earliest date that gives good precision
		//1. so, we'll cast all dates to 'year' and find all the ones that are the earliest, except if the precision was wider than 'year'
		//2. then, we'll find the ones that are the highest precision out of that set
		//3. then, we'll take the earliest one from the high-precision set - even if they all have the same year and precision, it will at least be the earliest one in the list below, which has been ordered deliberately
		let dates = [inception, dateOfOfficialOpening, serviceEntry].filter(date => date?.value != null)
		if (dates.length > 0) {
			dates.forEach(date => {
				assert.notEqual(date?.precision, null)
				date.precision = parseInt(date.precision)
				date.value = stringToDate(date.value)
				date.millis = date.value.toMillis()
			})
			dates.forEach(date => {
				if (date.precision > 11 || date.precision < 7) {
					throw new Error(`Unsupported precision: ${date.precision}`)
				}
			})
			//1.
			dates.forEach(date => {
				if (date.precision >= 9) {
					date.year = date.value.year
				}
			})
			let datesWithYear = dates.filter(date => date.year != null)
			if (datesWithYear.length > 0) {
				let minYear = Math.min(...datesWithYear.map(date => date.year))
				dates = datesWithYear.filter(date => date.year == minYear) //find the lowest dates
				assert.ok(dates.length > 0)
			}
			//2.
			// dates = sortBy(dates, 'precision')
			let bestPrecision = Math.max(...dates.map(date => date.precision))
			dates = dates.filter(date => date.precision == bestPrecision) //find the best precision
			//3.
			dates = sortBy(dates, 'millis')
			let chosenDate = dates[0]
			//
			date = dates.length > 0 ? formatDateToPrecision(chosenDate.value, chosenDate.precision) : null
		}
		const link = wikipediaLink ?? `https://www.wikidata.org/wiki/${qid}`
		return [lon, lat, name, link, 'Lighthouse', date]
	})
	return csv
}

function stringToDate(dateAsString) {
	//e.g. 1874-01-01T00:00:00Z
	//old dates have weird time zones. Thus if you parse midnight Zulu on an old date, it might actually be a few minutes prior to midnight, when expressed in the Europe/London timezone. This means that the midnight-zulu dates you get out of wikidata are incorrect - they're actually midnight Europe/London. So, we explicitly set the output timezone to GMT to force it to be in GMT rather than Europe/London (even though the latter would be more logical).
	return DateTime.fromISO(dateAsString).setZone('GMT')
}

function formatDateToPrecision(dateTime, precision) {
	switch (precision) {
		case 11:
			return dateTime.toFormat('dd/MM/yyyy') //day
		case 10:
			return dateTime.toFormat('MMMM yyyy') //month
		case 9:
			return dateTime.toFormat('yyyy') //year
		case 8:
			return Math.floor(dateTime.year / 10) * 10 + 's' //decade
		case 7:
			return Math.floor(dateTime.year / 100) * 100 + 's' //century
		default:
			throw new Error(`Unsupported precision: ${precision}`)
	}
}

function processPiers() {
	return new Promise((resolve, reject) => {
		fs.readFile(`${inputDir}/piers.json`, (err, rawData) => {
			if (err) {
				console.error(err)
				reject(err)
			}
			let data = JSON.parse(rawData)
			let docs = filterPages(data)
			let csv = docs
				.map(doc => {
					let allInfoboxes = doc.sections.filter(section => section.infoboxes != null).map(section => section.infoboxes)
					let infoBoxDocCoords = flatten(
						allInfoboxes.map(infoboxes => {
							return infoboxes
								.filter(infobox => infobox.coordinates != null && infobox.coordinates.text != null)
								.map(infobox => infobox.coordinates.text)
						})
					).filter(coords => coords != null)
					let docCoords = flatten(
						doc.sections
							.filter(section => section.templates != null)
							.map(section => {
								return section.templates.filter(template => template.template == 'coord')
							})
					).filter(sectionCoords => sectionCoords != null)
					let openings = flatten(
						allInfoboxes.map(infoboxes => {
							return infoboxes
								.filter(infobox => infobox.open != null && infobox.open.text != null)
								.map(infobox => infobox.open.text)
						})
					).filter(opening => opening != null)
					if (docCoords.length > 0) {
						let coordToSelect = 0 //choose the first one by default unless we can come up with a better match
						if (docCoords.length > 1) {
							let specificCoordFound = false
							let coordsInInfoboxFormat = docCoords.map(({lat, lon}) => `${lat}°N, ${lon}°W`)
							let unique = [...new Set(coordsInInfoboxFormat)]
							if (unique.length > 1) {
								//prefer something that matches what's in the infobox, if that appears to be useful
								let uniqueInfoBox = [...new Set(infoBoxDocCoords)]
								if (uniqueInfoBox.length == 1) {
									let potentialIndex = coordsInInfoboxFormat.findIndex(coord => uniqueInfoBox[0] == coord)
									if (potentialIndex != -1) {
										coordToSelect = potentialIndex
										specificCoordFound = true
									}
								}
							}
							if (!specificCoordFound) {
								console.warn(`Multiple coords found for "${name}"`)
							}
						}
						let docCoord = docCoords[coordToSelect]
						if (openings.length > 1) {
							console.warn(`Multiple open dates for "${name}"`)
						}
						let opening = openings.length > 0 ? openings[0] : null
						return {
							name: doc.title,
							lat: docCoord.lat,
							lng: docCoord.lon,
							opening: opening
						}
					} else {
						return null
					}
				})
				.filter(coord => coord != null)
				.map(pier => {
					return [pier.lng, pier.lat, pier.name, wikify(pier.name), 'Pier', pier.opening]
				})
			resolve(csv)
		})
	})
}

async function processData() {
	await backUpReferenceData('coastallandmarks', 'data.json')
	let csvsPromises = [processLighthouses(), processPiers()]
	let csvs = await Promise.all(csvsPromises)
	let csv = flatten(csvs).sort((rowA, rowB) => {
		return rowA[2].localeCompare(rowB[2])
	})
	csv = ['', ...csv] //add a dummy header row which will then be discarded by Converter
	const converter = new Converter(attributionString, columnHeaders)
	await converter.writeOutCsv(csv, `${outputDir}/coastallandmarks/data.json`)
	return await compareData('coastallandmarks', 'data.json')
}

await ifCmd(import.meta, processData)

export default processData
