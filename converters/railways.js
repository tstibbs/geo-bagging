const fs = require('fs');
const constants = require('./constants');
const Converter = require('./converter');
const {ifCmd} = require('./utils');
const inputDir = `${constants.tmpInputDir}/railways`;

const attributionString = "Adapted from data from wikipedia licenced under CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0/)";
const columnHeaders = "[Longitude,Latitude,Name,Link,Type,YearBuilt]"

const flatten = arrays => {return [].concat.apply([], arrays);}

function wikify(name) {
	return 'https://en.wikipedia.org/wiki/' + (name.replace(/ /g, '_'));;
}

function processData() {
	// return new Promise((resolve, reject) => {
		fs.readFile(`${inputDir}/pages.json`, (err, rawData) => {
			if (err) {
				console.error(err);
				reject(err);
			}
			let data = JSON.parse(rawData);
			
			let newData = data.map(page => {
				let templates = flatten(page.sections.filter(section =>
					section.templates != null
				).map(section =>
					section.templates
				));
				templates = templates.filter(template =>
					template.display != null && template.display.includes('title')
				);
				//console.log(templates);
				let coords = templates.filter(template =>
					template.template == 'coord'
				).map(template => {
					return {
						title: page.title,
						lat: template.lat,
						lon: template.lon
					}
				});
				templates.filter(template =>
					template.template == 'coords'
				).forEach(template => {
					coords.push({
						title: page.title,
						lat: template.list[0],
						lon: template.list[1]
					});
				});
				
				//console.log(coords);
				//TODO look at ones that are missing coords - can we fix them up somehow?
				if (coords.length > 1) {
					console.error(`unexpected condition for: ${page.title}`);
					return coords[0];
				} else if (coords.length == 1) {
					return coords[0];
				} else {
					console.error(`none found for: ${page.title}`)
					return null;
				};
				// Note the following have multiple coords which aren't being picked up correctly:
				// Bodmin and Wenford Railway
				// East Somerset Railway
				// Great Central Railway (heritage railway)
				// Isle of Wight Steam Railway
				// Llanberis Lake Railway
				// Weardale Railway
			});
			console.log(newData.filter(page => page != null).map(page => page.title).join('\n'))
		});
	// });
}

ifCmd(module, processData);

module.exports = processData;
