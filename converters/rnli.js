const request = require('request');
const Converter = require('./converter');
const get = require('./Utils').get;

const baseUrl = 'https://rnli.org';
const mainPageUrl = `${baseUrl}/find-my-nearest?type=Lifeboat-Station`;

const attributionString = "This file adapted from data available on rnli.org which is copyright © RNLI";
const columnHeaders = "[Longitude,Latitude,Name,Link]"

get(mainPageUrl).then(body => {
	let result = /<div data-rnli-map-data data-json="([^"]+)"><\/div>/.exec(body);
	let escapedJson = result[1];
	let unescapedJson = escapedJson.replace(/&quot;/g, '"')
	let data = JSON.parse(unescapedJson);
	let csv = data.Results.map(station => {
		return [
			station.Location.Longitude,
			station.Location.Latitude,
			station.Title,
			baseUrl + station.Url
		];
	});

	const converter = new Converter(attributionString, columnHeaders);
	converter.writeOutCsv(csv, '../js/bundles/rnli/data.json');
}).catch(error => console.error(error));
