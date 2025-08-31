import {readdir} from 'node:fs/promises'

import xlsx from 'xlsx'
import CombinedStream from 'combined-stream2'
import stream from 'stream'

import {tmpInputDir, outputDir} from './constants.js'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {backUpReferenceData} from './utils.js'
import Converter from './converter.js'
import compareData from './csv-comparer.js'

const inputDir = `${tmpInputDir}/milestones`

const attributionString = `Adapted from the the database of <a href="http://www.milestonesociety.co.uk/database.html">The Milestone Society</a>.`
const columnHeaders =
	'[Longitude,Latitude,Id,Type,Category,Location,Position,Design,Repository_Photo_Hyperlink,Additional_Photo_Hyperlink_1,Additional_Photo_Hyperlink_2]'

class WaypointsConverter extends Converter {
	constructor() {
		super(attributionString, columnHeaders)
	}

	extractColumns(record) {
		if (record.length > 1) {
			let lngLat = this._convertGridRef(record[5])
			if (lngLat != null) {
				return [
					lngLat[0], //lng
					lngLat[1], //lat
					record[1], //National_ID
					record[0], //type based on source file
					record[11], //Category
					record[9], //Location
					record[10], //Position
					record[12], //Design
					record[13], //Repository_Photo_Hyperlink
					record[16], //Additional_Photo_Hyperlink_1
					record[17] //Additional_Photo_Hyperlink_2
				]
			} else {
				return null //invalid lat/lng so don't export this row
			}
		} else {
			return null
		}
	}

	_streamString(str) {
		let s = new stream.Readable()
		s.push(str)
		s.push('\n')
		s.push(null)
		return s
	}

	_extractType(fileName) {
		if (fileName.startsWith('MSS_Summary_Sheet_Milestones')) {
			return 'Milestones'
		} else {
			let match = /MSS_Summary_Sheet_(.*)\.xls/.exec(fileName)
			return match[1]
		}
	}

	_readSheet(fileName) {
		let type = this._extractType(fileName)
		let workbook = xlsx.readFile(inputDir + '/' + fileName)
		let sheets = Object.keys(workbook.Sheets).filter(sheet => !/^Sheet\d$/.test(sheet))
		if (sheets.length > 1) {
			throw new Error(`We only know how to deal with a single sheet of data: ${sheets}`)
		}
		if (sheets.length == 0) {
			sheets = ['Sheet1'] //Milesmarkers (at least) doesn't name its sheets
		}
		let str = xlsx.utils.sheet_to_csv(workbook.Sheets[sheets[0]])
		//remove first line
		let body = str.substring(str.indexOf('\n') + 1, str.length)
		if (body.endsWith('\n')) {
			body = body.substring(0, body.length - 1)
		}
		body = body.replace(/\n/g, '\n' + type + ',')
		body = type + ',' + body
		return this._streamString(body)
	}

	async writeOut2(inputs, output) {
		let combinedStream = CombinedStream.create()
		inputs.forEach(input => combinedStream.append(this._readSheet(input)))
		await this.writeOutStream(combinedStream, output)
	}
}

async function buildDataFile() {
	await backUpReferenceData('milestones', 'data.json')
	let files = await readdir(inputDir)
	await new WaypointsConverter().writeOut2(files, `${outputDir}/milestones/data.json`)
	return await compareData('milestones', 'data.json')
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
