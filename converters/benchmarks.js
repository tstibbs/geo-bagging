const Converter = require('./converter');
const ifCmd = require('./utils').doIfCmdCall;
const fs = require('fs');
const constants = require('./constants');

const attributionString = "";
const columnHeaders = "[Longitude,Latitude,Name,type,condition]"

class BenchmarkConverter extends Converter {
	constructor(filter) {
		super(attributionString, columnHeaders);
		this._filter = filter;
	}
	
	extractColumns(record) {
		if (record.length > 1 && record[13] != '' && record[14] != '') {
			return [
				//Type,Number,Name,Grid Reference,Landranger,Location,Condition,Easting,Northing,Description,Waypoint,ID,Added,Latitude,Longitude
				record[14], //lng
				record[13], //lat
				record[2], //name
				record[0], //type
				record[6] //condition
			];
		} else {
			return null;
		}
	}
}

function buildDataFile() {
	(new BenchmarkConverter()).writeOut(`${constants.tmpInputDir}/benchmarks/input.csv`, `../js/bundles/benchmarks/data.json`);
}

ifCmd(module, buildDataFile)

module.exports = buildDataFile;
