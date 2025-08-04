import {ifCmd} from '@tstibbs/cloud-core-utils'
import {process, readDownloadedFiles} from './generic-source-geojson.js'

const sourceName = 'counties'

async function dataProducer() {
	let [ukCounties] = await readDownloadedFiles(sourceName, ['UK-counties.geojson'])
	let data = JSON.parse(ukCounties)
	data.features.forEach(feature => {
		feature.properties = {
			name: feature.properties.CTYUA23NM
		}
	})
	return data
}

async function buildDataFile() {
	return await process(sourceName, dataProducer)
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
