import {readFile} from 'fs/promises'

import {WBK} from 'wikibase-sdk'
import fetch from 'node-fetch'

import {wikidataHeaders} from './constants.js'

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

export function checkForDuplicates(results) {
	const keyedById = summariseToPk(results)
	const duplicates = Object.entries(keyedById).filter(([id, entry]) => entry.length > 1)
	if (duplicates.length > 0) {
		console.error(JSON.stringify(Object.fromEntries(duplicates), null, 2))
		throw new Error(`${duplicates.length} duplicates detected.`)
	}
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
