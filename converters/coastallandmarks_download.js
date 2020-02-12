const wikiUtils = require('./wikiUtils');

const {ifCmd, writeFile, createTempDir} = require('./utils');
require('global-tunnel-ng').initialize();

const constants = require('./constants');
const inputDir = `${constants.tmpInputDir}/coastallandmarks`;

async function downloadLighthouses() {
	const allPages = [
		'List_of_lighthouses_in_Scotland',
		'List_of_lighthouses_in_England',
		'List_of_lighthouses_in_Wales',
		'List_of_lighthouses_in_the_Channel_Islands',
		'List_of_lighthouses_in_the_Isle_of_Man',
		'List_of_lighthouses_in_Ireland'
	];
	let pageDocs = await wikiUtils.fetchPages(allPages);
	await writeFile(`${inputDir}/lighthouses.json`, JSON.stringify(pageDocs, null, 2));
}

async function downloadPiers() {
    let exclusions = ['Category:Piers in London'];//exclude piers in London, as few of them are piers of any interest (just floating ferry pontoons really)
	let categoryPages = await wikiUtils.fetchCategories('Category:Piers_in_the_United_Kingdom', exclusions);;
	if (categoryPages.pageNames.length > 0) {
		categoryPages.pages = await wikiUtils.fetchPages(categoryPages.pageNames);
		await writeFile(`${inputDir}/piers.json`, JSON.stringify(categoryPages, null, 2));
	}
}

async function fetchData() {
	await createTempDir(inputDir);
    await Promise.all([
        downloadLighthouses(),
        downloadPiers()
    ]);
}

ifCmd(module, fetchData);

module.exports = fetchData;
