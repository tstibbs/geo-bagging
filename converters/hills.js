const unzip = require('unzip');
const fs = require('fs');

const constants = require('./constants');
const ifCmd = require('./utils').doIfCmdCall;
const Converter = require('./converter');

const attributionString = "This file adapted from the The Database of British and Irish Hills (http://www.hills-database.co.uk/downloads.html), licenced under CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/deed.en_GB)";
const columnHeaders = "[Longitude,Latitude,Id,Name,Classification,Height(m)]"

const classesMap = { //used for mapping and filtering, by filtering in only the things we want
	'Ma': 'Ma',
	'Hu': 'Hu',
	'4': 'TU',
	'3': 'TU',
	'2': 'TU',
	'1': 'TU',
	'0': 'TU',
	'Sim': 'Sim',
	'M': 'M',
	'C': 'C',
	'G': 'G',
	'D': 'D',
	'5D': '5D',
	'5H': '5H',
	'Hew': 'Hew',
	'N': 'N',
	'5': '5',
	'W': 'W',
	'WO': 'W',
	'SIB': 'SIB',
	'CoU': 'CouT',
	'CoA': 'CouT',
	'CoL': 'CouT'
}

class HillConverter extends Converter {
	constructor(filtering) {
		super(attributionString, columnHeaders);
		this._filtering = filtering;
	}
	
	extractColumns(record) {
		if (record.length > 1) {
			var classification = record[10];
			if (classification == null) {
				console.log(record)
			}
			if (classification.indexOf(';') > -1) {
				throw new Error("Classification string already contains semi-colons; our replacement could break something. String is: " + classification);
			}
			var classes = classification.split(',');
			let allClasses = [];
			classes.forEach((classString) => {
				if (classString.endsWith('=')) {
					classString = classString.substring(0, classString.length - 1);
				}
				if (classString.length > 0) {
					if (this._filtering && !classString.startsWith('s') 
							&& !classString.startsWith('x') //i.e. it isn't a sub or a deletion
							&& (classString in classesMap)) {
						allClasses.push(classesMap[classString]);
					} else if (!this._filtering) {
						allClasses.push(classString);
					}
				}
			});
			allClasses = Array.from(new Set(allClasses));
			if (allClasses.length > 0) {
				classification = allClasses.join(';');
				return [
					record[34], //Longitude
					record[33], //Latitude
					record[0], //Number
					record[1], //Name
					classification, //Classification
					record[13], //Metres
					//record[30], //hill-bagging link //they appear to all just be http://www.hill-bagging.co.uk/googlemaps.php?qu=S&rf=[id] but some of them are different - so we'll construct them ourselves on the front end
				];
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
}

function buildDataFile() {
	fs.createReadStream(`${constants.tmpInputDir}/hills/hillcsv.zip`)
		.pipe(unzip.Parse())
		.on('entry', function (entry) {
			var fileName = entry.path;
			(new HillConverter(true)).writeOutStream(entry, '../js/bundles/hills/data.json');
			(new HillConverter(false)).writeOutStream(entry, '../js/bundles/hills/data_all.json');
		});
}

ifCmd(module, buildDataFile)

module.exports = buildDataFile;
