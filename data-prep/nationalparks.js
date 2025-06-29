import Converter from './converter.js'
import {tmpInputDir, outputDir} from './constants.js'
import {visualise as visualiseGeoJson, compare as compareGeoJson} from './geojson-comparer.js'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {backUpReferenceData, readFile, writeFile} from './utils.js'

const inputDirectory = `${tmpInputDir}/nationalparks`

async function buildDataFile() {
	await backUpReferenceData('nationalparks', 'data.geojson')
	let contents = await readFile(`${inputDirectory}/NationalParks.geojson`)
	let data = JSON.parse(contents)
	data.features = data.features.map(feature => {
		let name = feature.properties['NPARK21NM']
		let match = /^(The )?(.*?)( National Park| Authority)?$/g.exec(name)
		if (match != null && match[2] != null) {
			name = match[2]
		}
		feature.properties = {
			name: name
		}
		return feature
	})
	const fileName = `${outputDir}/nationalparks/data.geojson`
	await writeFile(fileName, JSON.stringify(data), 'utf-8')

	const converter = new Converter()
	let lastUpdated = converter.getLastUpdatedString()
	await converter.writeMetaData(fileName, data.features.length, lastUpdated)
	await visualiseGeoJson('nationalparks', 'old')
	await visualiseGeoJson('nationalparks', 'new')
	return await compareGeoJson('nationalparks')
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
