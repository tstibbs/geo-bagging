import Converter from './converter.js'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {backUpReferenceData, readdir} from './utils.js'
import {tmpInputDir, outputDir} from './constants.js'
import compareData from './csv-comparer.js'

const attributionString =
	'This file adapted from data available on http://trigpointing.uk/ which is a mixture of Public Domain and OGL from Ordnance Survey'
const columnHeaders = '[Longitude,Latitude,Id,Name,physical_type,condition]'

class TrigConverter extends Converter {
	constructor(filter) {
		super(attributionString, columnHeaders)
		this._filter = filter
	}

	extractColumns(record) {
		if (record.length > 1) {
			let lngLat = this._convertGridRef(record[0])
			let condition = record[7]
			if (lngLat != null && (this._filter == null || this._filter(lngLat, condition) === true)) {
				return [
					lngLat[0], //lng
					lngLat[1], //lat
					record[1], //waypoint (i.e. id)
					record[2], //name
					record[4], //physical_type
					condition
				]
			} else {
				return null
			}
		} else {
			return null
		}
	}
}

async function buildDataFile() {
	await backUpReferenceData('trigs', 'data_all.json')
	await backUpReferenceData('trigs', 'data_mini.json')
	const inputFile = `${tmpInputDir}/trigs/trigpoints.csv`

	//generate the 'all' data

	await new TrigConverter().writeOut(inputFile, `${outputDir}/trigs/data_all.json`)

	//generate the 'mini' data

	// bottom-right: NY 37193 01441 (54.404536 N -002.969059 E)
	// top-left: NY 09275 32238 (54.677004 N -003.408519 E)
	const minLat = 54.404536
	const maxLat = 54.677004
	const minLng = -3.408519
	const maxLng = -2.969059
	const conditions = ['Good', 'Remains', 'Toppled', 'Moved', 'Damaged', 'Converted']
	let miniConverter = new TrigConverter((lngLat, condition) => {
		let lng = lngLat[0]
		let lat = lngLat[1]
		return lng > minLng && lat > minLat && lng < maxLng && lat < maxLat && conditions.includes(condition)
	})
	await miniConverter.writeOut(inputFile, `${outputDir}/trigs/data_mini.json`)
	return await compareData('trigs', 'data_all.json')
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
