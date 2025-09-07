import {readFile} from 'node:fs/promises'

import {load as loadCheerio} from 'cheerio'

import Converter from './converter.js'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {backUpReferenceData} from './utils.js'
import {tmpInputDir, outputDir} from './constants.js'
import compareData from './csv-comparer.js'

const attributionString = `Adapted from data available on <a href="https://www.nationaltrust.org.uk/">nationaltrust.org.uk</a> which is copyright &copy; National Trust.`
const columnHeaders = '[Longitude,Latitude,Id,Name,Link,type,facilities]'

const attributeExcludes = ['fifty-things', 'available-for-weddings']

function configToFilters(config) {
	return Object.fromEntries(
		config
			.map(({reference, tagRefs}) => {
				return tagRefs.map(tagRef => [tagRef, reference])
			})
			.flat()
	)
}

function filterToTags(filters, tagRefs) {
	let tags = tagRefs.map(tagRef => filters[tagRef])
	tags = [...new Set(tags)] //make unique
	tags = tags
		.filter(tag => tag != undefined)
		.filter(tag => !attributeExcludes.includes(tag))
		.sort()
		.join(';')
	if (tags.length == 0) {
		tags = 'Other'
	}
	return tags
}

async function buildDataFile() {
	await backUpReferenceData('nt', 'data.json')
	let rawData = await readFile(`${tmpInputDir}/nt/data.json`, `UTF-8`)
	let rawConfigHtml = await readFile(`${tmpInputDir}/nt/config.html`, `UTF-8`)
	let $ = loadCheerio(rawConfigHtml)
	const config = JSON.parse($('#__NEXT_DATA__')[0].children[0].data).props.pageProps.filters
	const placeTypes = configToFilters(config.placeFilters.placeTypes)
	const placeFacilities = configToFilters(config.placeFilters.placeFacilities)

	let data = JSON.parse(rawData)
	let csv = data.multiMatch.results
		.map(entry => [parseInt(entry.id.value), entry])
		.sort((a, b) => a[0] - b[0])
		.map(([id, entry]) => {
			let types = filterToTags(placeTypes, entry.tagRefs)
			let facilities = filterToTags(placeFacilities, entry.tagRefs)
			return [entry.location.lon, entry.location.lat, id, entry.title, entry.websiteUrl, types, facilities]
		})
	let converter = new Converter(attributionString, columnHeaders, null, 0)
	await converter.writeOutCsv(csv, `${outputDir}/nt/data.json`)
	return await compareData('nt', 'data.json')
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
