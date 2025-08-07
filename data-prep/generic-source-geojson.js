import {readFile} from 'fs/promises'

import Converter from './converter.js'
import {tmpInputDir, outputDir} from './constants.js'
import {visualise as visualiseGeoJson, compare as compareGeoJson} from './geojson-comparer.js'
import {backUpReferenceData, writeFile} from './utils.js'
import {simplify} from './utils/geojson.js'

export async function readDownloadedFiles(sourceName, files) {
	const inputDirectory = `${tmpInputDir}/${sourceName}`
	return Promise.all(files.map(file => `${inputDirectory}/${file}`).map(file => readFile(file)))
}

export async function process(sourceName, dataProducer, simplificationTolerance) {
	await backUpReferenceData(sourceName, 'data.geojson')
	let data = await dataProducer()
	data = simplify(data, simplificationTolerance)
	const fileName = `${outputDir}/${sourceName}/data.geojson`
	await writeFile(fileName, JSON.stringify(data), 'utf-8')

	const converter = new Converter()
	let lastUpdated = converter.getLastUpdatedString()
	await converter.writeMetaData(fileName, data.features.length, lastUpdated)
	await visualiseGeoJson(sourceName, 'old')
	await visualiseGeoJson(sourceName, 'new')
	return await compareGeoJson(sourceName)
}
