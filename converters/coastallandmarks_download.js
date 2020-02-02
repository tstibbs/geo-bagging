const fs = require('fs');
const util = require("util");
const wikiUtils = require('./wikiUtils');

const {ifCmd, writeFile, readFile} = require('./utils');
require('global-tunnel-ng').initialize();

const constants = require('./constants');
const inputDir = `${constants.tmpInputDir}/coastallandmarks`;

if (!fs.existsSync(inputDir)){
	fs.mkdirSync(inputDir);
}

async function downloadLighthouses() {
	const allPages = [
		'List_of_lighthouses_in_Scotland',
		'List_of_lighthouses_in_England',
		'List_of_lighthouses_in_Wales',
		'List_of_lighthouses_in_the_Channel_Islands',
		'List_of_lighthouses_in_the_Isle_of_Man',
		'List_of_lighthouses_in_Ireland'
	];
	// let pageDocs = await wikiUtils.fetchPages(allPages);
	// //await writeFile(`${inputDir}/lighthousesLists.json`, JSON.stringify(pageDocs, null, 2));
	// console.log("from lists:");
	// console.log(pageDocs.map(doc => doc.title()).join('\n'));
	
	// let categoryPages = await wikiUtils.fetchCategories('Category:Lighthouses in the United Kingdom', ['Lighthouses in British Overseas Territories‎', 'Lists of lighthouses in British Overseas Territories']);
	// //console.log(categoryPages);
	// if (categoryPages.pageNames.length > 0) {
		// categoryPages.pages = await wikiUtils.fetchPages(categoryPages.pageNames);
		// //console.log(categoryPages);
		// await writeFile(`${inputDir}/lighthouseCategories.json`, JSON.stringify(categoryPages, null, 2));
		let parsed = await readFile(`${inputDir}/lighthouseCategories.json`);
		let filteredDocs = wikiUtils.filterPages(JSON.parse(parsed));
		//console.log("from categories:");
const flatten = arrays => {return [].concat.apply([], arrays);}
		//console.log(filteredDocs.map(doc => doc.title).join('\n'));
		
		let csv = filteredDocs.map(doc => {
			let docCoords = flatten(doc.sections.filter(section =>
				section.templates != null
			).map(section => {
				return section.templates.filter(template => 
					template.template == "coord"
				);
			})).filter(sectionCoords => 
				sectionCoords != null
			);
			if (docCoords.length > 0) {
				if (docCoords.length > 1) {
					console.log(`Multiple coords found for "${doc.title}"`)
				}
				let docCoord = docCoords[0];
				return {
					name: doc.title,
					lat: docCoord.lat,
					lng: docCoord.lon
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
			];
		});
		console.log(csv.map(csv => csv[2]).join('\n'))
	// }
}

async function downloadPiers() {
	let categoryPages = await wikiUtils.fetchCategories('Category:Piers_in_the_United_Kingdom', ['Category:Piers in London']);
	let pageNames = categoryPages.pages;
	if (pageNames.length > 0) {
		categoryPages.pages = await wikiUtils.fetchPages(categoryPages.pages);
		await writeFile(`${inputDir}/piers.json`, JSON.stringify(categoryPages, null, 2));
	}
}

function fetchData() {
	return Promise.all([
		downloadLighthouses(),
		// downloadPiers()
	]);
}

ifCmd(module, fetchData);

module.exports = fetchData;
