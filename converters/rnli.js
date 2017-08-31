const request = require('request');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const rnliWiki = require('./rnli-wikipedia');
const Converter = require('./converter');
const get = require('./Utils').get;

const baseUrl = 'https://rnli.org';
const mainPageUrl = `${baseUrl}/find-my-nearest?type=Lifeboat-Station`;

const attributionString = "This file adapted from data available on rnli.org which is copyright © RNLI and from https://en.wikipedia.org/wiki/List_of_RNLI_stations";
const columnHeaders = "[Longitude,Latitude,Name,Link,LifeboatTypes,LaunchMethods]"

function getRnliData() {
	return get(mainPageUrl).then(body => {
		let result = /<div data-rnli-map-data data-json="([^"]+)"><\/div>/.exec(body);
		let escapedJson = result[1];
		escapedJson = escapedJson.replace(/\\u0026/g, '&')
		let unescapedJson = entities.decode(escapedJson)
		let data = JSON.parse(unescapedJson);
		return data;

	});
}

function getWikipediaData() {
	return rnliWiki.fetchWikiData()
}

Promise.all([getRnliData(), getWikipediaData()]).then(values => { 
	let rnliData = values[0];
	let wikiData = values[1];
	let csv = rnliData.Results.map(station => {
		if (station.Title.includes('Bembridge')) {
		}
		let name = station.Title.replace(/\s+Lifeboat\s+Station/g, '').replace(/ Lifeboats/g, '').trim();
		let wikiStation = wikiData[name];
		let lifeboatTypes = 'Unknown';
		let launchMethods = 'Unknown';
		if (wikiStation != null) {
			lifeboatTypes = wikiStation.types.join(';');
			launchMethods = wikiStation.launchMethods.join(';');
		}
		return [
			station.Location.Longitude,
			station.Location.Latitude,
			name,
			baseUrl + station.Url,
			lifeboatTypes,
			launchMethods
		];
	});

	const converter = new Converter(attributionString, columnHeaders);
	converter.writeOutCsv(csv, '../js/bundles/rnli/data.json');
}).catch(error => console.error(error));
