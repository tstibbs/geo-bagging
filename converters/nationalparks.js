const Converter = require('./converter');
const constants = require('./constants');
const geojsonComparer = require('./geojson-comparer');
const {ifCmd, readFile, writeFile} = require('./utils');

const inputDirectory = `${constants.tmpInputDir}/nationalparks`;

async function buildDataFile() {
    await geojsonComparer.visualise('nationalparks', 'old');
	let contents = await readFile(`${inputDirectory}/NationalParks.json`);
	let data = JSON.parse(contents);
	data.features = data.features.map(feature => {
		let name = feature.properties.npark18nm
		let match = /^(The )?(.*?)( National Park)?$/g.exec(name);
		if (match != null && match[2] != null) {
			name = match[2]
		}
		feature.properties = {
			name: name
		};
		return feature;
	});
	const fileName = '../js/bundles/nationalparks/data.geojson'
	await writeFile(fileName, JSON.stringify(data), 'utf-8')
	
	const converter = new Converter();
	let lastUpdated = converter.getLastUpdatedString();
	await converter.writeMetaData(fileName, data.features.length, lastUpdated)
    await geojsonComparer.visualise('nationalparks', 'new');
    await geojsonComparer.compare('nationalparks');
}

ifCmd(module, buildDataFile)

module.exports = buildDataFile;
