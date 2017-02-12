const fs = require('fs');
const xlsx = require('xlsx');
const CombinedStream = require('combined-stream2');
const stream = require('stream');

const Converter = require('./converter');

const inputDir = 'milestones-input';

const attributionString = "This file adapted from the the database of 'The Milestone Society' (http://www.milestonesociety.co.uk/database.html).";
const columnHeaders = "[Longitude,Latitude,Id,Type,Category,Location,Position,Design,Repository_Photo_Hyperlink,Additional_Photo_Hyperlink_1,Additional_Photo_Hyperlink_2]"

class WaypointsConverter extends Converter {
	constructor() {
		super(attributionString, columnHeaders);
	}
	
	extractColumns(record) {
		if (record.length > 1) {
			let lngLat = this._convertGridRef(record[5]);
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
					record[17], //Additional_Photo_Hyperlink_2
				];
			} else {
				return null; //invalid lat/lng so don't export this row
			}
		} else {
			return null;
		}
	}
	
	_streamString(str) {
		var s = new stream.Readable();
		s.push(str);
		s.push('\n');
		s.push(null);
		return s;
	}
	
	_extractType(fileName) {
		if (fileName.startsWith('MSS_Summary_Sheet_Milestones')) {
			return 'Milestones';
		} else {
			var match = /MSS_Summary_Sheet_(.*)\.xls/.exec(fileName);
			return match[1];
		}
	}

	_readSheet(fileName) {
		var type = this._extractType(fileName);
		var workbook = xlsx.readFile(inputDir + '/' + fileName);
		var sheets = Object.keys(workbook.Sheets).filter(sheet => !/^Sheet\d$/.test(sheet));
		if (sheets.length > 1) {
			throw new Error(`We only know how to deal with a single sheet of data: ${sheets}`);
		}
		if (sheets.length == 0) {
			sheets = ['Sheet1']; //Milesmarkers (at least) doesn't name its sheets
		}
		var str = xlsx.utils.sheet_to_csv(workbook.Sheets[sheets[0]]);
		//remove first line
		var body = str.substring(str.indexOf('\n') + 1, str.length)
		if (body.endsWith('\n')) {
			body = body.substring(0, body.length - 1);
		}
		body = body.replace(/\n/g, '\n' + type + ',');
		body = type + ',' + body;
		return this._streamString(body);
	}
	
	writeOut2(inputs, output) {
		var combinedStream = CombinedStream.create();
		inputs.forEach(input => combinedStream.append(this._readSheet(input)));
		this.writeOutStream(combinedStream, output);
	}
}

fs.readdir(inputDir, (err, files) => {
	(new WaypointsConverter()).writeOut2(files, '../js/bundles/milestones/data.json');
})

