const fs = require('fs');
require('global-tunnel-ng').initialize();
const constants = require('./constants');
const Converter = require('./converter');
const wikiUtils = require('./wikiUtils');
const {ifCmd} = require('./utils');
const inputDir = `${constants.tmpInputDir}/coastallandmarks`;

const attributionString = "Adapted from data from wikipedia licenced under CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0/)";
const columnHeaders = "[Longitude,Latitude,Name,Link,Type,YearBuilt]"

const flatten = arrays => {return [].concat.apply([], arrays);}

function wikify(name) {
	return 'https://en.wikipedia.org/wiki/' + (name.replace(/ /g, '_'));;
}

function processLighthouses() {
	return new Promise((resolve, reject) => {
		fs.readFile(`${inputDir}/lighthouses.json`, (err, rawData) => {
			if (err) {
				console.error(err);
				reject(err);
			}
			let data = JSON.parse(rawData);
			
			let sections = flatten(data.map(page => page.sections));
			let rows = flatten(sections.filter(section => (
				section.tables != null && (
					section.title == 'Lighthouses' || 
					section.title == 'Maintained by Commissioners of Irish Lights'
				)
			)).map(section => section.tables[0]));
			let csv = rows.map(row => {
				let nameContainer = row.Name ? row.Name : row.Lighthouse
				let coordContainer = 
					row['County coordinates Grid Reference'] || 
					row['Area coordinates'] || 
					row['Location Coordinates'] || 
					row['Location coordinates'] || 
					row['Location & coordinates'];
					
				let name = nameContainer.text;
				let link = null;
				if (nameContainer.links && nameContainer.links.length > 0) {
					let pageRef = nameContainer.links.map(link => link.page).filter(page => page != null && page.length > 0)[0];
					link = wikify(pageRef);
				}
				let yearBuilt = row['Year built'] ? row['Year built'].text : '';
				let coordMatches = /(-?\d+\.\d+)°N, (-?\d+\.\d+)°W/.exec(coordContainer.text);
				if (coordMatches != null) {
					let north = coordMatches[1];
					let west = coordMatches[2];
					return [
						west,
						north,
						name,
						link,
						'Lighthouse',
						yearBuilt
					];
				} else {
					return null;
				}
			}).filter(record => record != null);
			resolve(csv);
		});
	});
}

function processPiers() {
	return new Promise((resolve, reject) => {
		fs.readFile(`${inputDir}/piers.json`, (err, rawData) => {
			if (err) {
				console.error(err);
				reject(err);
			}
			let data = JSON.parse(rawData);
			let docs = wikiUtils.filterPages(data);
			let csv = docs.map(doc => {
				let docCoords = flatten(doc.sections.filter(section =>
					section.templates != null
				).map(section => {
					return section.templates.filter(template => 
						template.template == "coord"
					);
				})).filter(sectionCoords => 
					sectionCoords != null
				);
				let openings = flatten(doc.sections.filter(section =>
					section.infoboxes != null
				).map(section => {
					return section.infoboxes.filter(infobox => 
						infobox.open != null && infobox.open.text != null
					).map(infobox =>
						infobox.open.text
					);
				})).filter(opening => 
					opening != null
				);
				if (docCoords.length > 0) {
					if (docCoords.length > 1) {
						console.log(`Multiple coords found for "${name}"`)
					}
					if (openings.length > 1) {
						console.log(`Multiple open dates for "${name}"`)
					}
					let docCoord = docCoords[0];
					let opening = openings.length > 0 ? openings[0] : null;
					return {
						name: doc.title,
						lat: docCoord.lat,
						lng: docCoord.lon,
						opening: opening
					}
				} else {
					return null;
				}
			}).filter(coord =>
				coord != null
			).map(pier => {
				return [
					pier.lng,
					pier.lat,
					pier.name,
					wikify(pier.name),
					'Pier',
					pier.opening
				];
			});
			resolve(csv);
		});
	});
}

async function processData() {
	let csvsPromises = [processLighthouses(), processPiers()];
	let csvs = await Promise.all(csvsPromises);
    let csv = flatten(csvs).sort((rowA, rowB) => {
        return rowA[2].localeCompare(rowB[2]);
    });
    const converter = new Converter(attributionString, columnHeaders);
    return converter.writeOutCsv(csv, '../js/bundles/coastallandmarks/data.json');
}

ifCmd(module, processData);

module.exports = processData;
