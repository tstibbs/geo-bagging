const cheerio = require('cheerio');
const request = require('request');
const Stream = require('stream');
const Converter = require('./converter');
const utils = require('./utils');
const ifCmd = utils.doIfCmdCall;
const get = utils.get;

const attributionString = "This file adapted from data available on www.nationaltrust.org.uk which is copyright © National Trust";
const columnHeaders = "[Longitude,Latitude,Id,Name,Link,type,facilities]"

const allDataPath = 'https://www.nationaltrust.org.uk/search/data/all-places';
const basePath = 'https://www.nationaltrust.org.uk/search?query=&type=place&view=map';

function getHtml(path) {
	return get(path).then(([body, path]) => 
		cheerio.load(body)
	);
}

function getIdsForAspect(aspect) {
	let placePromises = aspect.values.map(type => 
		get(`${basePath}&${aspect.param}=${type}`)
	);
	return Promise.all(placePromises).then(values => {
		let placeIds = {};
		values.forEach(([body, path], i) => {
			let attribute = aspect.values[i];
			let result = /<script>var nt_searchResultsPlaceIds = \[(\d+(, \d+)*)\]<\/script>/.exec(body);
			if (result == null) {
				console.log('result null');
				console.log(path);
				console.log(body);
				placeIds[attribute] = [];
			} else {
				placeIds[attribute] = JSON.parse('[' + result[1] + ']');
			}
		});
		return placeIds;
	});
}

function buildDataFile() {
	getHtml(basePath).then($ => {
		let placeTypes = $("input[name='PlaceFilter']").toArray().map(elem => $(elem).attr('value'));
		let facilityTypes = $("input[name='FacilityFilter']").toArray().map(elem => $(elem).attr('value'));
		return {
			placeTypes: {values: placeTypes, param: 'PlaceFilter'},
			facilityTypes: {values: facilityTypes, param: 'FacilityFilter'}
		};
	}).then(aspects => {
		let placePromises = getIdsForAspect(aspects.placeTypes);
		let facilityPromises = getIdsForAspect(aspects.facilityTypes);
		return Promise.all([placePromises, facilityPromises]).then(datas => {
			return alldata = {
				places: datas[0],
				facilities: datas[1]
			};
		});
	}).then(idsByAspect => {
		const aspectsById = {};
		Object.entries(idsByAspect).forEach(([aspect, attributesToIds]) => {
			Object.keys(attributesToIds).forEach(attribute => {
				attributesToIds[attribute].forEach(id => {
					if (aspectsById[id] == null) {
						aspectsById[id] = {};
					}
					if (aspectsById[id][aspect] == null) {
						aspectsById[id][aspect] = [];
					}
					aspectsById[id][aspect].push(attribute);
				});
			});
		});
		return Promise.all([get(allDataPath), aspectsById]);
	}).then(([[body, path], aspectsById]) => {
		let data = JSON.parse(body);
		let csv = Object.entries(data)
			.filter(([id, details]) => details.location != null)
			.map(([id, details]) => [parseInt(id), details])
			.sort((a, b) => a[0] - b[0])
			.map(([id, details]) => {
				function stringVals(id, aspect) {
					if (aspectsById[id] == null || aspectsById[id][aspect] == null) {
						return 'Other';
					} else {
						return aspectsById[id][aspect].join(';');
					}
				}
				let type = stringVals(id, 'places');
				let facilities = stringVals(id, 'facilities');
				return [
					details.location.longitude,
					details.location.latitude,
					id,
					details.title,
					details.websiteUrl,
					type,
					facilities
				];
			});

		const converter = new Converter(attributionString, columnHeaders);
		converter.writeOutCsv(csv, '../js/bundles/nt/data.json');
	}).catch(error => console.error(error));
}

ifCmd(module, buildDataFile)

module.exports = buildDataFile;
