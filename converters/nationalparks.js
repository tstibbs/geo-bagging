const fs = require('fs');
const Converter = require('./converter');
const constants = require('./constants');
const ifCmd = require('./utils').doIfCmdCall;

const inputDirectory = `${constants.tmpInputDir}/nationalparks`;

function buildDataFile() {
	fs.readFile(`${inputDirectory}/NationalParks.json`, (err, contents) => {
		if (err) {
			console.log(err);
		} else {
			let data = JSON.parse(contents);
			data.features = data.features.map(feature => {
				let name = feature.properties.npark16nm
				let match = /^(The )?(.*?)( National Park)?$/g.exec(name);
				if (match != null && match[2] != null) {
					name = match[2]
				}
				feature.properties = {
					npark16nm: name // the key is a bit random, but keeping compatability with the original file is a good idea 
				};
				return feature;
			});
			const fileName = '../js/bundles/nationalparks/data.geojson'
			fs.writeFile(fileName, JSON.stringify(data) , 'utf-8', (err) => {
				console.log("Done.");
			});
			
			const converter = new Converter();
			let lastUpdated = converter.getLastUpdatedString();
			converter.writeMetaData(fileName, data.features.length, lastUpdated)
		}
	});
}

ifCmd(module, buildDataFile)

module.exports = buildDataFile;
