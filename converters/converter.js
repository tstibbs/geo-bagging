const Transform = require('stream').Transform;
const csv = require('csv');
const fs = require('fs');

function header(attributionString, columnHeaders, lastUpdated) {
return `{
"attribution": "${attributionString}",
"headers": "${columnHeaders}",
"lastUpdated": "${lastUpdated}",
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
	constructor(attribution, columnHeaders) {
		this._header = header(attribution, columnHeaders, new Date().toISOString());
		this._first = true;
		this._second = true;
	}

	_formatLine(record) {
		if (this._first === true) { // header row
			this._first = false;
			return '';
		} else {
			let columns = this.extractColumns(record);
			if (columns != null) {
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
		throw new Error("abstract");
	}

	writeOut(input, output) {
		writeOutStream(fs.createReadStream(input), output);
	}

	writeOutStream(inputStream, output) {
		inputStream.pipe(csv.parse())
			.pipe(csv.transform(this._formatLine.bind(this)))
			.pipe(new HeaderFooterTransformer(this._header))
			.pipe(fs.createWriteStream(output));
	}
}

module.exports = Converter;
