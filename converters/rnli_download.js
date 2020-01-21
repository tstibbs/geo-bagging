const {ifCmd} = require('./utils');
const downloadFiles = require('./downloader').download;
const rnliWikipedia = require('./rnli-wikipedia')

const urls = {
	'https://opendata.arcgis.com/datasets/7dad2e58254345c08dfde737ec348166_0.csv': 'lifeboatStations.csv', //https://hub.arcgis.com/datasets/7dad2e58254345c08dfde737ec348166_0
};

function download() {
	let p1 = downloadFiles('rnli', urls);
	let p2 = rnliWikipedia.fetchWikiData()
	return Promise.all([p1, p2]);
}

ifCmd(module, download)

module.exports = download;
