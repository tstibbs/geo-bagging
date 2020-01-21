const fs = require('fs');
const xml2js = require('xml2js');
const streamify = require('stream-array');
const Stream = require('stream');
const constants = require('./constants');
const {ifCmd, readFile} = require('./utils');
const Converter = require('./converter');
const xslt = require('./xslt');

const attributionString = "This file adapted from the database of the Defence of Britain project (http://archaeologydataservice.ac.uk/archives/view/dob/download.cfm). Copyright of the Council for British Archaeology (2006) Defence of Britain Archive [data-set]. York: Archaeology Data Service [distributor] https://doi.org/10.5284/1000327";
const columnHeaders = "[Longitude,Latitude,Id,Name,Link,location,condition,description,imageLinks]"

class DobConverter extends Converter {
	constructor() {
		super(attributionString, columnHeaders);
	}
	
	extractColumns(point) {
		let descriptionText = point.description[0];
		let location = this._match(descriptionText, /<b>Location: <\/b>(.*?)<br \/>/g)[0];
		let condition = this._match(descriptionText, /<b>Condition: <\/b>(.*?)<br \/>/g)[0];
		let description = this._match(descriptionText, /<b>Description: <\/b>(.*?)<\/td>/g)[0];
		let link = this._match(descriptionText, /<a href="(http\:\/\/archaeologydataservice.ac.uk\/archives\/view.*?)">/g)[0];
		
		let $ = this._parseHtml(descriptionText);
		let images = $('img').map((i, elem) => 
			$(elem).attr('src')
		).toArray().filter(url => 
			url.endsWith('.jpg') && !url.endsWith('logo.jpg')
		);
		
		let coords = point.coordinates[0].split(',');
		let lng = coords[0];
		let lat = coords[1];
		let name = point.name[0];
		let id = '';
		if (name.includes(': ')) {
			let splits = name.split(': ');
			name = splits.slice(0, splits.length - 1).join(': ');//all but the last bit
			id = splits[splits.length - 1];
		}
		return [
			lng,
			lat,
			id,
			name,
			link,
			location,
			condition,
			description,
			images
		];
	}
}

const converter = new DobConverter();
const parser = new xml2js.Parser();

async function buildDataFile() {
	await xslt('defence-extract.xslt', 'defence/doc.kml', 'defence/out.xml');
	let data = await readFile(`${constants.tmpInputDir}/defence/out.xml`);
	let result = await parser.parseStringPromise(data);
	await converter.writeOutCsv(result.points.point, '../js/bundles/defence/data.json');
}

ifCmd(module, buildDataFile)

module.exports = buildDataFile;
