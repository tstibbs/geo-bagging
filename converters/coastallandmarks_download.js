const fs = require('fs');
const wtf = require('wtf_wikipedia');
require('global-tunnel-ng').initialize();
const ifCmd = require('./utils').doIfCmdCall;
const constants = require('./constants');
const inputDir = `${constants.tmpInputDir}/coastallandmarks`;

function downloadLighthouses() {
	const allPages = [
		'List_of_lighthouses_in_Scotland',
		'List_of_lighthouses_in_England',
		'List_of_lighthouses_in_Wales',
		'List_of_lighthouses_in_the_Channel_Islands',
		'List_of_lighthouses_in_the_Isle_of_Man',
		'List_of_lighthouses_in_Ireland'
	];
	wtf.fetch(allPages).then(pageDocs => {
		let data = JSON.stringify(pageDocs, null, 2);
		fs.writeFile(`${inputDir}/lighthouses.json`, data, function(err) {
			if (err) {
				console.error(err);
			}
		});
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
			wtf.fetch(pageNames).then(docs => {
				let data = {
					categories: categoryPages,
					docs: docs
				};
				fs.writeFile(`${inputDir}/piers.json`, JSON.stringify(data, null, 2), function(err) {
					if (err) {
						console.error(err);
					}
				});
			});
		}
	});
}

function fetchData() {
	downloadLighthouses();
	downloadPiers();
}

ifCmd(module, fetchData);

module.exports = fetchData;
