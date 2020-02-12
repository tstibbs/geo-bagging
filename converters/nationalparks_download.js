const {ifCmd} = require('./utils');
const downloadFiles = require('./downloader').download;

const urls = {
    // https://opendata.arcgis.com/datasets/f41bd8ff39ce4a2393c2f454006ea60a_0.geojson -> http://geoportal1-ons.opendata.arcgis.com/datasets/f41bd8ff39ce4a2393c2f454006ea60a_0/data
	'https://opendata.arcgis.com/datasets/f41bd8ff39ce4a2393c2f454006ea60a_0.geojson': 'NationalParks.json', 
};

function download() {
	return downloadFiles('nationalparks', urls);
}

ifCmd(module, download)

module.exports = download;
