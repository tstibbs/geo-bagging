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

const attributionString = `Adapted from the <a href="http://www.hills-database.co.uk/downloads.html">The Database of British and Irish Hills</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC&nbsp;BY&#8209;SA&nbsp;4.0</a>.`
const columnHeaders = '[Longitude,Latitude,Id,Name,Classification,HeightBand,Height(m)]'

class HillConverter extends Converter {
	constructor() {
		super(attributionString, columnHeaders)
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
					allClasses.push(classString)
				}
			})
			allClasses = Array.from(new Set(allClasses))
			if (allClasses.length == 0) {
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
	return new Promise((resolve, reject) => {
		fs.createReadStream(`${tmpInputDir}/hills/hillcsv.zip`)
			.pipe(unzipper.Parse())
			.on('entry', async entry => {
				let chunks = []
				for await (let chunk of entry) {
					chunks.push(chunk)
				}
				let buffer = Buffer.concat(chunks)
				await new HillConverter().writeOutStream(toStream(buffer), `${outputDir}/hills/data.json`)
				let result = await compareData('hills', 'data.json')
				resolve(result)
			})
			.on('error', error => reject(new Error(error)))
	})
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
