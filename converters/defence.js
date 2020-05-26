const xml2js = require('xml2js');
const constants = require('./constants');
const {ifCmd, readFile} = require('./utils');
const Converter = require('./converter');
const xslt = require('./xslt');
const {guessType} = require('./defence-type-calculation')

const attributionString = "This file adapted from the database of the Defence of Britain project (http://archaeologydataservice.ac.uk/archives/view/dob/download.cfm). Copyright of the Council for British Archaeology (2006) Defence of Britain Archive [data-set]. York: Archaeology Data Service [distributor] https://doi.org/10.5284/1000327";
const columnHeaders = "[Longitude,Latitude,Id,Type,Purpose,Categories,Link,location,Condition,description,imageLinks]"

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
			id = name.split(': ').slice(-1)[0];
		} else {
            console.error(`No id found, name was: ${name}`)
        }
        let folders = point.folders[0].folder
        if (condition == "Removed" || condition == "Infilled") {
            let last = folders.slice(-1)[0]
            if (last.startsWith("Removed ")) {
                let penultimate = folders.slice(-2)[0]
                let lastWithoutRemoved = last.substring("Removed ".length)
                if (penultimate == lastWithoutRemoved) {
                    //the last one is just a duplicate of the penulatimate one, but with 'removed' at the start, but this is redundant due to the condition field anyway
                    folders.splice(-1)//i.e. drop the last one
                } else {
                    //last one is not a dup, so just tidy up to remove the redundant 'removed ' part
                    folders[folders.length - 1] = lastWithoutRemoved
                }
            }
        }
        folders = folders
            .filter(folder => folder != 'Defence of Britain Sites')
            .map(folder => folder.endsWith(':') ? folder.slice(0, -1) : folder)//TODO if this matches the 'style' then remove it?
            .map(folder => folder.replace(/ 0F /g, ' of '))//fixing a weird typo
            .map(folder =>
                //convert to title case
                folder.replace(/\b[a-zA-Z]+\b/g, part => //only touch things that look like words
                    part.slice(0, 1).toUpperCase() + part.slice(1).toLowerCase()
                    //part.toLowerCase().replace(/(^| )\w/g, char => char.toUpperCase())
                )
                .replace(' Of ', ' of ')
                .replace(' And ', ' and ')
            )
        
        let type = guessType(folders)
        let purpose = folders[0]
        folders = folders.slice(1)

		return [
			lng,
			lat,
            id,
            type,
            purpose,
			folders,
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
