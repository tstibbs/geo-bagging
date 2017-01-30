const Converter = require('./converter');
const fs = require('fs');

const attributionString = "Downloaded from http://trigpointing.uk/";
const columnHeaders = "[Longitude,Latitude,Id,Name,physical_type,condition]"

class TrigConverter extends Converter {
	constructor() {
		super(attributionString, columnHeaders);
	}
	
	extractColumns(record) {
		if (record.length > 1) {
			let lngLat = this._convertGridRef(record[0]);
			if (lngLat != null) {
				return [
					lngLat[0], //lng
					lngLat[1], //lat
					record[1], //waypoint (i.e. id)
					record[2], //name
					record[4], //physical_type
					record[7], //condition
				];
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
}

fs.readdir('trigs-input', (err, files) => {
	function process(prefix) {
		let regex = new RegExp(prefix + "-\\d+.csv");
		let foundFiles = files.filter((file) => regex.test(file) );
		if (foundFiles.length != 1) {
			console.error(`Should be exactly 1 file called ${prefix}-[date as numbers].csv, but were: ${foundFiles}`);
			process.exit(1);
		}
		(new TrigConverter()).writeOut('trigs-input/' + foundFiles[0], `../js/bundles/trigs/data_${prefix}.json`);
	}
	process('mini');
	process('all');
});
