import Converter from './converter.js'
import {tmpInputDir, outputDir} from './constants.js'
import {
	visualise as visualiseGeoJson,
	compare as compareGeoJson
} from './geojson-comparer.js'
import {ifCmd, readFile, writeFile} from './utils.js'

const inputDirectory = `${tmpInputDir}/nationalparks`

async function buildDataFile() {
	await visualiseGeoJson('nationalparks', 'old')
	let contents = await readFile(`${inputDirectory}/NationalParks.json`)
	let data = JSON.parse(contents)
	data.features = data.features.map(feature => {
		let name = feature.properties.npark18nm
		let match = /^(The )?(.*?)( National Park)?$/g.exec(name)
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
	await visualiseGeoJson('nationalparks', 'new')
	await compareGeoJson('nationalparks')
}

ifCmd(import.meta, buildDataFile)

export default buildDataFile
