import {ifCmd} from '@tstibbs/cloud-core-utils'
import {process, readDownloadedFiles} from './generic-source-geojson.js'

const SIMPLIFICATION_TOLERANCE = 0.0001
const sourceName = 'counties'
const attributionString = `Office for National Statistics licensed under the <a href="https://www.ons.gov.uk/methodology/geography/licences">OGL v.3.0</a> and Tailte Éireann licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC&nbsp;BY&#8209;SA&nbsp;4.0</a>. Contains OS data &copy; Crown copyright and database right ${new Date().getFullYear()}.`

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
	return await process(sourceName, attributionString, dataProducer, SIMPLIFICATION_TOLERANCE)
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
