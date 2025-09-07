import {readFile} from 'node:fs/promises'

import Converter from './converter.js'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {backUpReferenceData} from './utils.js'
import {tmpInputDir, outputDir} from './constants.js'
import {convertWikiData} from './rnli_wikipedia.js'
import compareData from './csv-comparer.js'
import {floatToSensiblePrecision} from './utils/coord.js'

const attributionString = `Contains Open Data licensed under the GIS Open Data Licence &copy; RNLI and from wikipedia licensed under <a href="https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License">CC&nbsp;BY&#8209;SA&nbsp;4.0</a>.`
const columnHeaders = '[Longitude,Latitude,Id,Name,Link,LifeboatTypes,LaunchMethods]'

class RnliConverter extends Converter {
	constructor(wikiData) {
		super(attributionString, columnHeaders, null, 0)
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
		if (record != null) {
			let lng = floatToSensiblePrecision(record.attributes.Long)
			let lat = floatToSensiblePrecision(record.attributes.Lat)
			let stationName = record.attributes.Station
			let id = record.attributes.FuncLocId
			let url = record.attributes.URL

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

			return [lng, lat, id, stationName, url, lifeboatTypesString, launchMethodsString]
		} else {
			return null
		}
	}
}

async function buildDataFile() {
	await backUpReferenceData('rnli', 'data.json')
	let wikiData = await convertWikiData()
	const inputDir = `${tmpInputDir}/rnli`
	let inputData = JSON.parse(await readFile(`${inputDir}/lifeboatStations.json`)).features
	await new RnliConverter(wikiData).writeOutCsv(inputData, `${outputDir}/rnli/data.json`)
	return await compareData('rnli', 'data.json')
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
