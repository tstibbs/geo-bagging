import {readFile} from 'fs/promises'

import {WBK} from 'wikibase-sdk'
import fetch from 'node-fetch'
import geolib from 'geolib'

import {wikidataHeaders} from './constants.js'

const MAX_DEDUPE_DISTANCE = 500 //metres

const wbk = WBK({
	instance: 'https://www.wikidata.org',
	sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

export async function queryWikidata(queryFile) {
	const sparql = await readFile(queryFile, 'UTF-8')
	const url = wbk.sparqlQuery(sparql)
	const response = await fetch(url, {headers: wikidataHeaders})
	const results = await response.text()
	const simplifiedResults = wbk.simplify.sparqlResults(results)
	return simplifiedResults
}

function clone(thing) {
	return JSON.parse(JSON.stringify(thing))
}

function closerThan(coord1, coord2, maxDistance) {
	let distance = geolib.getDistance(
		{latitude: coord1.lat, longitude: coord1.lon},
		{latitude: coord2.lat, longitude: coord2.lon}
	)
	return distance <= maxDistance
}

export function deduplicate(results) {
	const keyedById = summariseToPk(results)
	Object.entries(keyedById)
		.filter(([id, entries]) => entries.length > 1)
		.forEach(([id, entries]) => {
			let clonedEntries = entries.map(clone)
			clonedEntries.forEach(entry => {
				delete entry['lon']
				delete entry['lat']
			})
			clonedEntries = clonedEntries.map(JSON.stringify)
			let allSameInfo = clonedEntries.slice(1).every(entry => entry === clonedEntries[0])
			if (allSameInfo) {
				let coords = entries.map(({lat, lon}) => ({
					lat,
					lon
				}))
				let allCloseEnough = coords.slice(1).every(entry => closerThan(entry, coords[0], MAX_DEDUPE_DISTANCE))
				if (allCloseEnough) {
					console.warn(`Multiple coords found for ${id} but were all less than ${MAX_DEDUPE_DISTANCE}m distant.`)
					entries.splice(1)
				}
			}
		})
	const duplicates = Object.entries(keyedById).filter(([id, entries]) => entries.length > 1)
	if (duplicates.length > 0) {
		console.error(JSON.stringify(Object.fromEntries(duplicates), null, 2))
		throw new Error(`${duplicates.length} duplicates detected.`)
	}
	return Object.values(keyedById).map(entries => entries[0])
}

function summariseToPk(results) {
	results = results.reduce((all, entry) => {
		let id = entry.item.value
		if (!(id in all)) {
			all[id] = []
		}
		all[id].push(entry)
		return all
	}, {})
	return results
}
