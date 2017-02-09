//java -jar E:\m2r\net\sourceforge\saxon\saxon\9.1.0.8\saxon-9.1.0.8.jar -xsl:defence-extract.xslt -s:defence-input/doc.kml -o:defence-input/out.xml

const fs = require('fs');
const xml2js = require('xml2js');
const streamify = require('stream-array');
const Stream = require('stream');
const Converter = require('./converter');

const attributionString = "This file adapted from the database of the Defence of Britain project.";
const columnHeaders = "[Longitude,Latitude,Id,Name,location,condition,description]"

class DobConverter extends Converter {
	constructor() {
		super(attributionString, columnHeaders, [3, 5]);
	}
	
	extractColumns(point) {
		let locationMatches = point.description[0].match('<b>Location: </b>(.*?)<br />');
		let location = locationMatches != null && locationMatches.length >= 2 ? locationMatches[1] : null;
		let conditionMatches = point.description[0].match('<b>Condition: </b>(.*?)<br />');
		let condition = conditionMatches != null && conditionMatches.length >= 2 ? conditionMatches[1] : null;
		let descriptionMatches = point.description[0].match('<b>Description: </b>(.*?)</td>');
		let description = descriptionMatches != null && descriptionMatches.length >= 2 ? descriptionMatches[1] : null;
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
			location,
			condition,
			description
		];
	}
}

const converter = new DobConverter();
const parser = new xml2js.Parser();

fs.readFile('defence-input/out.xml', (err, data) => {
    parser.parseString(data, (err, result) => {
		let points = result.points.point;

		const readable = new Stream.Readable({objectMode: true})
		points.forEach(point => readable.push(point))
		// end the stream
		readable.push(null)

		converter.writeOutParsedStream(readable, '../js/bundles/defence/data.json')
    });
});
