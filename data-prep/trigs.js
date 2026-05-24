import Converter from './converter.js'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {backUpReferenceData} from './utils.js'
import {tmpInputDir, outputDir} from './constants.js'
import compareData from './csv-comparer.js'
import geolib from 'geolib'

const attributionString = `Adapted from data available on <a href="https://trigpointing.uk/">trigpointing.uk</a> which is a mixture of Public Domain and OGL from Ordnance Survey.`
const columnHeaders = '[Longitude,Latitude,OSGB,distance,Id,Name,physical_type,condition]'

const conditions = {
	G: 'Good',
	S: 'Slightly damaged',
	C: 'Converted',
	D: 'Damaged',
	R: 'Remains',
	T: 'Toppled',
	M: 'Moved',
	V: 'Unreachable but visible',
	Q: 'Possibly missing',
	N: "Couldn't find it",
	X: 'Destroyed',
	P: 'Inaccessible',
	U: 'Unknown',
	Z: 'Not Logged'
}

class TrigConverter extends Converter {
	constructor(filter) {
		super(attributionString, columnHeaders)
		this._filter = filter
	}

	extractColumns(record) {
		if (record.length > 1) {
			const id = record[1] //waypoint (i.e. id)
			const name = record[2]
			const condition = conditions[record[3]]
			if (condition != 'Moved') {
				// || condition == 'Toppled') {
				return null
			}
			const type = record[5] //type_name
			// const lat = record[8]//wgs_lat
			// const lng = record[9]//wgs_long
			// if (this._filter == null || this._filter([lng, lat], condition) === true) {
			const osgbRef = record[11]
			let lngLat
			if (/^[A-Z] /.test(osgbRef)) {
				return null
			}
			lngLat = [record[9], record[8]]
			// } else {
			let [osgbLng, osgbLat] = this._convertGridRef(osgbRef)
			// }
			let lng = lngLat[0]
			let lat = lngLat[1]
			const distance = geolib.getDistance({latitude: lat, longitude: lng}, {latitude: osgbLat, longitude: osgbLng})
			if (distance < 10) {
				return null
			}
			if (lngLat != null && (this._filter == null || this._filter(lngLat, condition) === true)) {
				return [
					// id,waypoint,name,physical_type,condition,status_id,status_name,wgs_lat,wgs_long,wgs_height,osgb_gridref,osgb_eastings,osgb_northings,osgb_height,county,town,fb_number,current_use,historic_use
					// 21548,TP21548,Seymour Farm,Block,G,30,Minor mark,51.24762,-0.84911,-1,SU 80423 50456,480423,150456,0,Hampshire,FLEET,,none,4th order
					lngLat[0], //lng
					lngLat[1], //lat
					osgbRef,
					distance,
					id,
					name,
					type,
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
	// await backUpReferenceData('trigs', 'data_all.json')
	// await backUpReferenceData('trigs', 'data_mini.json')
	const inputFile = `${tmpInputDir}/trigs/trigpoints.csv`

	//generate the 'all' data

	await new TrigConverter().writeOut(inputFile, `${outputDir}/trigs/data_all.json`)

	//generate the 'mini' data

	// bottom-right: NY 37193 01441 (54.404536 N -002.969059 E)
	// top-left: NY 09275 32238 (54.677004 N -003.408519 E)
	// const minLat = 54.404536
	// const maxLat = 54.677004
	// const minLng = -3.408519
	// const maxLng = -2.969059
	// const conditionFilters = ['Good', 'Remains', 'Toppled', 'Moved', 'Damaged', 'Converted']
	// let miniConverter = new TrigConverter((lngLat, condition) => {
	// 	let lng = lngLat[0]
	// 	let lat = lngLat[1]
	// 	return lng > minLng && lat > minLat && lng < maxLng && lat < maxLat && conditionFilters.includes(condition)
	// })
	// await miniConverter.writeOut(inputFile, `${outputDir}/trigs/data_mini.json`)
	// return await compareData('trigs', 'data_all.json')
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
