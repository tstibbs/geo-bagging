import Converter from './converter.js'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {backUpReferenceData} from './utils.js'
import {tmpInputDir, outputDir} from './constants.js'
import {convertWikiData} from './rnli_wikipedia.js'
import compareData from './csv-comparer.js'

const attributionString =
	'Contains (https://hub.arcgis.com/datasets/7dad2e58254345c08dfde737ec348166_0) licensed under the GIS Open Data Licence &copy; RNLI and data from (https://en.wikipedia.org/wiki/List_of_RNLI_stations)'
const columnHeaders = '[Longitude,Latitude,Name,Link,LifeboatTypes,LaunchMethods]'

class RnliConverter extends Converter {
	constructor(wikiData) {
		super(attributionString, columnHeaders)
		this._wikiData = wikiData
	}

	_findExtraData(stationName) {
		//stations are called slightly different things in the RNLI data and in the wikipedia data
		stationName = stationName.toLowerCase()
		let wikiStation = this._wikiData[stationName]
		if (wikiStation == null) {
			stationName = /^([\w\s-&']+)( \([\w\s-&']+\))?$/.exec(stationName)[1]
			wikiStation = this._wikiData[stationName]
		}
		if (wikiStation == null) {
			stationName = stationName.replace('-', ' ')
			wikiStation = this._wikiData[stationName]
		}
		if (wikiStation == null) {
			stationName = stationName.replace('&', 'and')
			wikiStation = this._wikiData[stationName]
		}
		if (wikiStation == null) {
			//hard-coded replacements, but not much we can do about this - they're just called different things
			if (stationName.includes('enniskillen lower')) {
				stationName = 'Enniskillen'
			} else if (stationName.includes('enniskillen upper')) {
				stationName = 'Carrybridge'
			}
		}
		return wikiStation
	}

	extractColumns(record) {
		if (record.length > 1) {
			//OBJECTID,Station Type,County,Division,Region,Country,Lifesaving Area,Lifesaving Region,URL,Station,SAP_ID,Lat (DecDeg),(Long (DecDeg),x,y
			let lng = parseFloat(record[12])
			let lat = parseFloat(record[11])
			let stationName = record[9]
			let url = record[8]

			let lifeboatTypesString = 'Unknown'
			let launchMethodsString = 'Unknown'
			let wikiStation = this._findExtraData(stationName)
			if (wikiStation != null) {
				let {types, launchMethods} = wikiStation
				if (launchMethods.length > types.length) {
					throw new Error(
						`${stationName} has ${launchMethods.length} launch methods but only ${types.length} lifeboat types.`
					)
				}
				if (launchMethods.length < types.length) {
					console.warn(
						`${stationName} has ${types.length} lifeboat types but only ${launchMethods.length} launch methods.`
					)
				}
				lifeboatTypesString = types.join(';')
				launchMethodsString = launchMethods.join(';')
			}

			return [lng, lat, stationName, url, lifeboatTypesString, launchMethodsString]
		} else {
			return null
		}
	}
}

async function buildDataFile() {
	await backUpReferenceData('rnli', 'data.json')
	let wikiData = await convertWikiData()
	const inputDir = `${tmpInputDir}/rnli`
	await new RnliConverter(wikiData).writeOut(`${inputDir}/lifeboatStations.csv`, `${outputDir}/rnli/data.json`)
	return await compareData('rnli', 'data.json')
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
