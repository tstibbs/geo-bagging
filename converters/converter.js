const Transform = require('stream').Transform;
const Stream = require('stream');
const csv = require('csv');
const fs = require('fs');
const cheerio = require('cheerio');
const gridconversion = require('./gridconversion');
const {writeFile} = require('./utils');

function header(attributionString, columnHeaders) {
return `{
"attribution": "${attributionString}",
"headers": "${columnHeaders}",
"data": [
`;
}
const footer = `
]
}
`;

class HeaderFooterTransformer extends Transform {
	constructor(header) {
		super();
		this._header = header;
		this._first = true;
	}

	_transform(chunk, enc, cb) {
		if (this._first === true) {
			this.push(this._header);
			this._first = false;
		}
		this.push(chunk);
		cb();
	}

	_flush(cb) {
		this.push(footer);
		cb();
	}
}

class Converter {
	constructor(attribution, columnHeaders, axisIndexes) {
		this._header = header(attribution, columnHeaders);
		this._axisIndexes = axisIndexes;
		this._axes = [];
		this._first = true;
		this._second = true;
		this._lastUpdated = new Date().toISOString().split('T')[0];
	}
	
	getLastUpdatedString() {
		return this._lastUpdated;
	}
	
	_parseHtml(htmlString) {
		return cheerio.load(htmlString);
	}
	
	_match(input, regex, groupNumber) {
		groupNumber = groupNumber != null ? groupNumber : 1;
		let matches = [];
		let m;
		while (m = regex.exec(input)) {
			matches.push(m[1]);
		}
		return matches;
	}
	
	_convertGridRef(gridRef) {
		try {
			let lngLat = gridconversion.gridRefToLngLat(gridRef);
			//don't need more precision than 0.00001 because we can't display it. So no point sending all that data back from the server
			let lng = parseFloat(lngLat[0].toFixed(5));
			let lat = parseFloat(lngLat[1].toFixed(5));
			return [lng, lat];
		} catch (err) {
			console.log(err.message);
			return null;
		}
	}

	_formatLine(record) {
		if (this._first === true) { // header row
			this._first = false;
			return '';
		} else {
			let columns = this.extractColumns(record);
			if (columns != null) {
				this._lineCount++;
				if (this._axisIndexes != null) {
					for (let i = 0; i < this._axisIndexes.length; i++) {
						if (this._axes[i] == null) {
							this._axes[i] = new Set();
						}
						this._axes[i].add(columns[this._axisIndexes[i]]);
					}
				}
				let columnString = JSON.stringify(columns);
				if (this._second) {
					this._second = false;
					return columnString;
				} else {
					return ',\n' + columnString;
				}
			} else {
				return '';
			}
		}
	}
	
	extractColumns(record) {
		if (Array.isArray(record)) {
			return record;
		} else {
			throw new Error("abstract");
		}
	}

	async writeOut(input, fileName) {
		await this.writeOutStream(fs.createReadStream(input), fileName);
	}

	async writeOutStream(readable, fileName) {
		let csvParser = csv.parse({
			relax_column_count: true // extraneous spaces in the headers of the milestones spreadsheets cause it to think some sheets have more columns than they do
		});
		await this.writeOutParsedStream(readable.pipe(csvParser), fileName);
	}

	writeOutParsedStream(readable, fileName) {
		return new Promise((resolve, reject) => {
			this._lineCount = 0;
			let writeStream = fs.createWriteStream(fileName);
			readable
				.pipe(csv.transform({parallel: 1}, this._formatLine.bind(this)))
				.pipe(new HeaderFooterTransformer(this._header))
				.pipe(writeStream);
			writeStream.on('finish', async () => {
				await this.writeMetaData(fileName, this._lineCount, this._lastUpdated);
				this._lineCount = 0;
				resolve();
			});
			writeStream.on('error', error => {
				reject(error);
			});
		});
	}
	
	async writeOutCsv(csvContent, fileName) {
		const readable = new Stream.Readable({objectMode: true});
		csvContent.forEach(entry => readable.push(entry));
		// end the stream
		readable.push(null);

		await this.writeOutParsedStream(readable, fileName);
	}
	
	async writeMetaData(fileName, recordCount, lastUpdated) {
		let data = {
			recordCount,
			lastUpdated
		};
		let contents = JSON.stringify(data);
		await writeFile(`${fileName}.meta`, contents);
	}
}

module.exports = Converter;
