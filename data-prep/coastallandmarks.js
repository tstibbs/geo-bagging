import fs from 'fs'
import {readFile} from 'fs/promises'

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
		//no particular reason to prefer one of these dates over the other, so might as well take the one with the greatest precision
		let dates = [dateOfOfficialOpening, inception, serviceEntry].filter(date => date?.value != null)
		dates = sortBy(dates, 'precision')
		const date = dates.length > 0 ? convertDateToPrecision(dates.slice(-1)[0]) : null
		const link = wikipediaLink ?? `https://www.wikidata.org/wiki/${qid}`
		return [lon, lat, name, link, 'Lighthouse', date]
	})
	return csv
}

function convertDateToPrecision(dateObj) {
	//e.g. 1874-01-01T00:00:00Z
	const {value: dateAsString, precision} = dateObj
	//old dates have weird time zones. Thus if you parse midnight Zulu on an old date, it might actually be a few minutes prior to midnight, when expressed in the Europe/London timezone. This means that the midnight-zulu dates you get out of wikidata are incorrect - they're actually midnight Europe/London. So, we explicitly set the output timezone to GMT to force it to be in GMT rather than Europe/London (even though the latter would be more logical).
	let dateTime = DateTime.fromISO(dateAsString).setZone('GMT')
	switch (precision) {
		case '11':
			return dateTime.toFormat('dd/MM/yyyy') //day
		case '10':
			return dateTime.toFormat('MMMM yyyy') //month
		case '9':
			return dateTime.toFormat('yyyy') //year
		case '8':
			return Math.floor(dateTime.year / 10) * 10 + 's' //decade
		case '7':
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
					let docCoords = flatten(
						doc.sections
							.filter(section => section.templates != null)
							.map(section => {
								return section.templates.filter(template => template.template == 'coord')
							})
					).filter(sectionCoords => sectionCoords != null)
					let openings = flatten(
						doc.sections
							.filter(section => section.infoboxes != null)
							.map(section => {
								return section.infoboxes
									.filter(infobox => infobox.open != null && infobox.open.text != null)
									.map(infobox => infobox.open.text)
							})
					).filter(opening => opening != null)
					if (docCoords.length > 0) {
						if (docCoords.length > 1) {
							console.log(`Multiple coords found for "${name}"`)
						}
						if (openings.length > 1) {
							console.log(`Multiple open dates for "${name}"`)
						}
						let docCoord = docCoords[0]
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
	const converter = new Converter(attributionString, columnHeaders)
	await converter.writeOutCsv(csv, `${outputDir}/coastallandmarks/data.json`)
	return await compareData('coastallandmarks', 'data.json')
}

await ifCmd(import.meta, processData)

export default processData
