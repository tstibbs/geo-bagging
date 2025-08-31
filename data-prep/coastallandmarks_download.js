import {writeFile} from 'node:fs/promises'

import {fetchPages, fetchCategories} from './wikipediaUtils.js'
import {queryWikidata} from './wikidataUtils.js'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {createTempDir} from './utils.js'
import {tmpInputDir} from './constants.js'

const inputDir = `${tmpInputDir}/coastallandmarks`

async function downloadLighthouses() {
	let pageDocs = await queryWikidata('coastallandmarks-lighthouses.rq')
	await writeFile(`${inputDir}/lighthouses.json`, JSON.stringify(pageDocs, null, 2))
}

async function downloadPiers() {
	let exclusions = ['Category:Piers in London'] //exclude piers in London, as few of them are piers of any interest (just floating ferry pontoons really)
	let categoryPages = await fetchCategories('Category:Piers_in_the_United_Kingdom', exclusions)
	if (categoryPages.pageNames.length > 0) {
		categoryPages.pages = await fetchPages(categoryPages.pageNames)
		await writeFile(`${inputDir}/piers.json`, JSON.stringify(categoryPages, null, 2))
	}
}

async function fetchData() {
	await createTempDir(inputDir)
	await Promise.all([downloadLighthouses(), downloadPiers()])
}

await ifCmd(import.meta, fetchData)

export default fetchData
