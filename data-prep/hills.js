import unzipper from 'unzipper'
import fs from 'fs'
import {Readable} from 'stream'

import {tmpInputDir, outputDir} from './constants.js'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {backUpReferenceData} from './utils.js'
import Converter from './converter.js'
import compareData from './csv-comparer.js'

import {heightBandHill, heightBandMtn, heightBand3000} from '../ui/src/js/bundles/hills/constants.js'

const UNCLASSIFIED_CLASSIFICATION = 'Un'

const attributionString =
	'This file adapted from the The Database of British and Irish Hills (http://www.hills-database.co.uk/downloads.html), licenced under CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/deed.en_GB)'
const columnHeaders = '[Longitude,Latitude,Id,Name,Classification,HeightBand,Height(m)]'

const classesMap = {
	//used for mapping and filtering, by filtering in only the things we want
	Ma: 'Ma',
	Hu: 'Hu',
	4: 'TU',
	3: 'TU',
	2: 'TU',
	1: 'TU',
	0: 'TU',
	Sim: 'Sim',
	M: 'M',
	C: 'C',
	G: 'G',
	D: 'D',
	'5D': '5D',
	'5H': '5H',
	Hew: 'Hew',
	N: 'N',
	5: '5',
	W: 'W',
	WO: 'W',
	SIB: 'SIB',
	CoU: 'CouT',
	CoA: 'CouT',
	CoL: 'CouT'
}

class HillConverter extends Converter {
	constructor(filtering) {
		super(attributionString, columnHeaders)
		this._filtering = filtering
	}

	extractColumns(record) {
		if (record.length > 1) {
			let classification = record[10]
			if (classification == null) {
				console.log(record)
			}
			if (classification.indexOf(';') > -1) {
				throw new Error(
					'Classification string already contains semi-colons; our replacement could break something. String is: ' +
						classification
				)
			}
			let classes = classification.split(',').map(cls => cls.trim())
			let allClasses = []
			classes.forEach(classString => {
				if (classString.endsWith('=')) {
					classString = classString.substring(0, classString.length - 1)
				}
				if (classString.length > 0) {
					if (
						this._filtering &&
						!classString.startsWith('s') &&
						!classString.startsWith('x') && //i.e. it isn't a sub or a deletion
						classString in classesMap
					) {
						allClasses.push(classesMap[classString])
					} else if (!this._filtering) {
						allClasses.push(classString)
					}
				}
			})
			allClasses = Array.from(new Set(allClasses))
			if (!this._filtering && allClasses.length == 0) {
				allClasses = [UNCLASSIFIED_CLASSIFICATION]
			}
			if (allClasses.length > 0) {
				classification = allClasses.join(';')
				let height = record[13]
				let heightBand = toHeightBand(height)
				return [
					record[34], //Longitude
					record[33], //Latitude
					record[0], //Number
					record[1], //Name
					classification, //Classification
					heightBand,
					height //Metres
					//record[30], //hill-bagging link //they appear to all just be http://www.hill-bagging.co.uk/googlemaps.php?qu=S&rf=[id] but some of them are different - so we'll construct them ourselves on the front end
				]
			} else {
				return null
			}
		} else {
			return null
		}
	}
}

function toHeightBand(height) {
	if (height < 610) {
		return heightBandHill
	} else if (height < 914.4) {
		return heightBandMtn
	} else {
		return heightBand3000
	}
}

function toStream(buffer) {
	let stream = new Readable()
	stream.push(buffer)
	stream.push(null)
	return stream
}

async function buildDataFile() {
	await backUpReferenceData('hills', 'data.json')
	await backUpReferenceData('hills', 'data_all.json')
	return new Promise((resolve, reject) => {
		fs.createReadStream(`${tmpInputDir}/hills/hillcsv.zip`)
			.pipe(unzipper.Parse())
			.on('entry', async entry => {
				let chunks = []
				for await (let chunk of entry) {
					chunks.push(chunk)
				}
				let buffer = Buffer.concat(chunks)
				await new HillConverter(true).writeOutStream(toStream(buffer), `${outputDir}/hills/data.json`)
				await new HillConverter(false).writeOutStream(toStream(buffer), `${outputDir}/hills/data_all.json`)
				let result1 = await compareData('hills', 'data.json')
				let result2 = await compareData('hills', 'data_all.json')
				if (result1 != null && result2 != null) {
					resolve(`${result1}; ${result2}`)
				} else if (result1 != null) {
					resolve(result1)
				} else if (result2 != null) {
					resolve(result2)
				} else {
					resolve()
				}
			})
			.on('error', error => reject(error))
	})
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
