const fs = require('fs');
const Converter = require('./converter');
const {ifCmd, readFile} = require('./utils');
const constants = require('./constants');

const attributionString = "Contains (https://hub.arcgis.com/datasets/7dad2e58254345c08dfde737ec348166_0) licensed under the GIS Open Data Licence &copy; RNLI and data from (https://en.wikipedia.org/wiki/List_of_RNLI_stations)";
const columnHeaders = "[Longitude,Latitude,Name,Link,LifeboatTypes,LaunchMethods]"

class RnliConverter extends Converter {
	constructor(wikiData) {
		super(attributionString, columnHeaders);
		this._wikiData = wikiData;
	}
	
	_findExtraData(stationName) {
		//stations are called slightly different things in the RNLI data and in the wikipedia data
		stationName = stationName.toLowerCase();
		let wikiStation = this._wikiData[stationName];
		if (wikiStation == null) {
			stationName = /^([\w\s-&]+)( \([\w\s-&]+\))?$/.exec(stationName)[1];
			wikiStation = this._wikiData[stationName];
		}
		if (wikiStation == null) {
			stationName = stationName.replace('-', ' ');
			wikiStation = this._wikiData[stationName];
		}
		if (wikiStation == null) {
			stationName = stationName.replace('&', 'and');
			wikiStation = this._wikiData[stationName];
		}
		if (wikiStation == null) {
			//hard-coded replacements, but not much we can do about this - they're just called different things
			if (stationName.includes('enniskillen lower')) {
				stationName = 'Enniskillen'
			} else if (stationName.includes('enniskillen upper')) {
				stationName = 'Carrybridge'
			}
		}
		return wikiStation;
	}
	
	extractColumns(record) {
		if (record.length > 1) {
			//X,Y,OBJECTID_1,OBJECTID,SAP_ID,Station,Station_Ty,County,Region,Division,Country,Lifesaving,Lifesavi_1,Lat_Dec_De,Long_Dec_D,URL
			var lng = parseFloat(record[0]);
			var lat = parseFloat(record[1]);
			var stationName = record[5];
			var url = record[15];
			
			let lifeboatTypes = 'Unknown';
			let launchMethods = 'Unknown';
			let wikiStation = this._findExtraData(stationName);
			if (wikiStation != null) {
				lifeboatTypes = wikiStation.types.join(';');
				launchMethods = wikiStation.launchMethods.join(';');
			}

			return [
				lng,
				lat,
				stationName,
				url,
				lifeboatTypes,
				launchMethods
			];
		} else {
			return null;
		}
	}
}

async function buildDataFile() {
	const inputDir = `${constants.tmpInputDir}/rnli`;
	let data = await readFile(`${inputDir}/wiki.json`);
	let wikiData = JSON.parse(data);
	await (new RnliConverter(wikiData)).writeOut(`${inputDir}/lifeboatStations.csv`, `../js/bundles/rnli/data.json`);
}

ifCmd(module, buildDataFile)

module.exports = buildDataFile;
