import {writeFile} from 'node:fs/promises'
import {createReadStream, createWriteStream} from 'node:fs'
import {pipeline} from 'node:stream/promises'
import Stream from 'node:stream'
import {parse, transform} from 'csv'
import {load as loadCheerio} from 'cheerio'

import gridconversion from '@tstibbs/geo-bagging-shared/conversion.js'
import {pointIsInGb} from './utils/bounds.js'
import {floatToSensiblePrecision} from './utils/coord.js'

function header(attributionString, columnHeaders) {
	return `{
"attribution": ${JSON.stringify(attributionString)},
"headers": "${columnHeaders}",
"data": [
`
}
const footer = `
]
}
`

class Converter {
	constructor(attribution, columnHeaders, axisIndexes, inputHeaderRows = 1) {
		this._header = header(attribution, columnHeaders)
		this._axisIndexes = axisIndexes
		this._axes = []
		this._inputHeaderRows = inputHeaderRows // the number of header rows in the input file to ignore
		this._lastUpdated = new Date().toISOString().split('T')[0]
	}

	getLastUpdatedString() {
		return this._lastUpdated
	}

	_parseHtml(htmlString) {
		return loadCheerio(htmlString)
	}

	_match(input, regex, groupNumber) {
		groupNumber = groupNumber != null ? groupNumber : 1
		let matches = []
		let m
		while ((m = regex.exec(input))) {
			matches.push(m[1])
		}
		return matches
	}

	_convertGridRef(gridRef) {
		let lngLat = gridconversion.gridRefToLngLat(gridRef)
		let lng = floatToSensiblePrecision(lngLat[0])
		let lat = floatToSensiblePrecision(lngLat[1])
		return [lng, lat]
	}

	_formatLine(record) {
		if (this._inputHeaderRows > 0) {
			// header row
			this._inputHeaderRows--
			return ''
		} else {
			let columns = this.extractColumns(record)
			if (columns != null) {
				let lng = columns[0]
				let lat = columns[1]
				if (!pointIsInGb(lat, lng)) {
					console.log('Not in British Isles: ' + JSON.stringify(columns))
					return ''
				}
				this._lineCount++
				if (this._axisIndexes != null) {
					for (let i = 0; i < this._axisIndexes.length; i++) {
						if (this._axes[i] == null) {
							this._axes[i] = new Set()
						}
						this._axes[i].add(columns[this._axisIndexes[i]])
					}
				}
				let columnString = JSON.stringify(columns)
				if (this._lineCount == 1) {
					return columnString
				} else {
					return ',\n' + columnString
				}
			} else {
				return ''
			}
		}
	}

	extractColumns(record) {
		if (Array.isArray(record)) {
			return record
		} else {
			throw new Error('abstract')
		}
	}

	async writeOut(input, fileName) {
		await this.writeOutStream(createReadStream(input), fileName)
	}

	async writeOutStream(readable, fileName) {
		let csvParser = parse({
			relax_column_count: true // extraneous spaces in the headers of the milestones spreadsheets cause it to think some sheets have more columns than they do
		})
		await this.writeOutParsedStream(readable.pipe(csvParser), fileName)
	}

	async writeOutParsedStream(readable, fileName) {
		this._lineCount = 0
		let writeStream = createWriteStream(fileName)
		await pipeline(this._header, writeStream, {end: false})
		await pipeline(readable, transform({parallel: 1}, this._formatLine.bind(this)), writeStream, {end: false})
		await pipeline(footer, writeStream)
		await this.writeMetaData(fileName, this._lineCount, this._lastUpdated)
	}

	async writeOutCsv(csvContent, fileName) {
		const readable = new Stream.Readable({objectMode: true})
		csvContent.forEach(entry => readable.push(entry))
		// end the stream
		readable.push(null)

		await this.writeOutParsedStream(readable, fileName)
	}

	async writeMetaData(fileName, recordCount, lastUpdated) {
		let data = {
			recordCount,
			lastUpdated
		}
		let contents = JSON.stringify(data)
		await writeFile(`${fileName}.meta`, contents)
	}
}

export default Converter
