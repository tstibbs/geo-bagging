const fs = require('fs');
const util = require("util");
const wtf = require('wtf_wikipedia');

const {ifCmd} = require('./utils');
require('global-tunnel-ng').initialize();
const writeFile = util.promisify(fs.writeFile);

const constants = require('./constants');
const inputDir = `${constants.tmpInputDir}/coastallandmarks`;

if (!fs.existsSync(inputDir)){
	fs.mkdirSync(inputDir);
}

function downloadLighthouses() {
	const allPages = [
		'List_of_lighthouses_in_Scotland',
		'List_of_lighthouses_in_England',
		'List_of_lighthouses_in_Wales',
		'List_of_lighthouses_in_the_Channel_Islands',
		'List_of_lighthouses_in_the_Isle_of_Man',
		'List_of_lighthouses_in_Ireland'
	];
	return wtf.fetch(allPages).then(pageDocs => {
		let data = JSON.stringify(pageDocs, null, 2);
		return writeFile(`${inputDir}/lighthouses.json`, data);
	});
}

let categoryPages = {};

function fetchCategories(category) {
	return wtf.category(category).then(result => {
		if (result.pages != null && result.pages.length > 0) {
			categoryPages[category] = result.pages;
		}
		return Promise.all(result.categories.filter(category => 
			//exclude piers in London, as few of them are piers of any interest (just floating ferry pontoons really)
			category.title != "Category:Piers in London"
		).map(category => {
			return fetchCategories(category.title)
		}));
	});
}

function downloadPiers() {
	return fetchCategories('Category:Piers_in_the_United_Kingdom').then(() => {
		let pageNames = [].concat(...(Object.entries(categoryPages).map(([category, pages]) => pages))).map(page => page.title);
		if (pageNames.length > 0) {
			return wtf.fetch(pageNames).then(docs => {
				let data = {
					categories: categoryPages,
					docs: docs
				};
				return writeFile(`${inputDir}/piers.json`, JSON.stringify(data, null, 2));
			});
		}
	});
}

function fetchData() {
	return Promise.all([
		downloadLighthouses(),
		downloadPiers()
	]);
}

ifCmd(module, fetchData);

module.exports = fetchData;
