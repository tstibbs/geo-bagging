//java -jar E:\m2r\net\sourceforge\saxon\saxon\9.1.0.8\saxon-9.1.0.8.jar -xsl:follies-extract.xslt -s:follies-input/Follies.kml -o:follies-input/out.xml

const fs = require('fs');
const xml2js = require('xml2js');
const Stream = require('stream');
const Converter = require('./converter');

const gardenStructure = 'Garden structure';
const arch = 'Arch_Gateway';
const grotto = 'Grotto';
const tower = 'Tower';
const castle = 'Castle';
const building = 'Building';

const knownTypes = {
	'Alcove': gardenStructure,
	'Arbour': gardenStructure,
	'Temple': gardenStructure,
	'Aviary': gardenStructure,
	'Gazebo': gardenStructure,
	'Hermitage': gardenStructure,
	'Pavilion': gardenStructure,
	'Pavillion': gardenStructure,
	'Mausoleum': gardenStructure,
	'Well': gardenStructure,
	'Tomb': gardenStructure,
	'Seat': gardenStructure,
	'Platform': gardenStructure,
	'Kiosk': gardenStructure,

	'Gate': arch,
	'Arch': arch,
	'Arches': arch,
	'Gateway': arch,
	'Gatehouse': arch,

	'Grotto': grotto,
	'Cave': grotto,

	'Tower': tower,
	'Twr': tower,
	'Obelisk': tower,
	'Pagoda': tower,
	'Pillar': tower,
	'Pyramid': tower,
	'Column': tower,
	'Chimney': tower,
	'Memorial': tower,
	'Monument': tower,
	'Momument': tower,//spelling mistake?
	'Munument': tower,//spelling mistake?
	'Stand': tower,
	
	'Castle': castle,
	'Fort': castle,

	'Abbey': building,
	'Church': building,
	'Chapel': building,
	'Belvedere': building,
	'Toll': building,
	'Summerhouse': building,
	'Rotunda': building,
	'Pantheon': building,
	'Lodge': building,
	'Dairy': building,
	'Boathouse': building,
	'House': building,
}

const attributionString = "This file adapted from the Folly Maps (http://www.follies.org.uk/follymaps.htm) with the kind permission of Paul from The Folly Fellowship.";
const columnHeaders = "[Longitude,Latitude,Name,Type,Url,OtherImageLinks]"

function getTagForName(name) {
	name = name.toLowerCase();
	let found = Object.keys(knownTypes).filter(type => name.includes(type.toLowerCase()));
	
	let realType = null;
	if (found.length == 0) {
		realType = 'Other';
	} else {
		let selected = null;
		if (found.length > 1) {
			let maxValueIndex = -1;
			let selectedArrayIndex = -1;
			let maxMatchLength = -1;
			found.forEach((type, arrayIndex) => {
				let endIndex = name.lastIndexOf(type.toLowerCase()) + type.length;
				let matchLength = type.length;
				//get the right-most match, getting the longest if there's multiple
				if (endIndex > maxValueIndex || (endIndex == maxValueIndex && matchLength > maxMatchLength)) {
					maxValueIndex = endIndex;
					selectedArrayIndex = arrayIndex;
					maxMatchLength = matchLength;
				}
			});
			selected = found[selectedArrayIndex];
		} else {
			selected = found[0];
		}
		realType = knownTypes[selected];
	}
	return realType;
}


class FolliesConverter extends Converter {
	constructor() {
		super(attributionString, columnHeaders);
	}
	
	extractColumns(point) {
		let name = point.name[0];
		let type = getTagForName(name);
		
		let coordsString = point.coordinates[0];
		coordsString = coordsString.trim();
		let coords = coordsString.split(',');
		let lng = coords[0];
		let lat = coords[1];
		
		let description = point.description[0];
		description == '' ? '' : description;
		
		let mainLinks = point.link[0].split(' ');
		let mainLink = mainLinks[0];
		let imageLinks = this._match(description, /"(http.*?googleusercontent\.com.*?)"/g);
		let geographLinks = this._match(description, /\((http\:\/\/www.geograph\.org\.uk.photo.*?)\)/g);
		
		mainLinks.push.apply(mainLinks, imageLinks);
		mainLinks.push.apply(mainLinks, geographLinks);
		
		mainLinks = Array.from(new Set(mainLinks));
		
		var mainLinkIndex = mainLinks.indexOf(mainLink);
		if (mainLinkIndex != -1) {
			mainLinks.splice(mainLinkIndex, 1);
		}
		let imageLinksString = mainLinks.join(';');
		
		return [
			lng,
			lat,
			name,
			type,
			mainLink,
			imageLinksString
		];
	}
}

const converter = new FolliesConverter();
const parser = new xml2js.Parser();

fs.readFile('follies-input/out.xml', (err, data) => {
    parser.parseString(data, (err, result) => {
		let points = result.points.point;

		const readable = new Stream.Readable({objectMode: true});
		points.forEach(point => readable.push(point));
		// end the stream
		readable.push(null);

		converter.writeOutParsedStream(readable, '../js/bundles/follies/data.json');
    });
});
