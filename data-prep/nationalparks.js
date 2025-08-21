import {ifCmd} from '@tstibbs/cloud-core-utils'
import {process, readDownloadedFiles} from './generic-source-geojson.js'

const SIMPLIFICATION_TOLERANCE = 0.000001
const sourceName = 'nationalparks'
const attributionString = `Office for National Statistics licensed under the <a href="https://www.ons.gov.uk/methodology/geography/licences">OGL v.3.0</a>. Contains OS data &copy; Crown copyright and database right ${new Date().getFullYear()}.`

async function buildDataFile() {
	const dataProducer = async () => {
		let [contents] = await readDownloadedFiles(sourceName, ['NationalParks.geojson'])
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
		return data
	}
	return await process(sourceName, attributionString, dataProducer, SIMPLIFICATION_TOLERANCE)
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
