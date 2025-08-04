import {ifCmd} from '@tstibbs/cloud-core-utils'
import {process, readDownloadedFiles} from './generic-source-geojson.js'

const sourceName = 'counties'

async function dataProducer() {
	let [ukCounties, roiCounties] = await readDownloadedFiles(sourceName, ['UK-counties.geojson', 'RoI-counties.geojson'])
	let uk = JSON.parse(ukCounties)
	let roi = JSON.parse(roiCounties)
	uk.features.forEach(feature => {
		feature.properties = {
			name: feature.properties.CTYUA23NM
		}
	})
	roi.features.forEach(feature => {
		let name = feature.properties.COUNTY
		feature.properties = {
			name: name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase()
		}
	})
	return {
		type: 'FeatureCollection',
		features: [...uk.features, ...roi.features]
	}
}

async function buildDataFile() {
	return await process(sourceName, dataProducer)
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
