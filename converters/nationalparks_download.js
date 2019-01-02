const fs = require('fs');
const ifCmd = require('./utils').doIfCmdCall;
const downloadFiles = require('./downloader').download;

const urls = {
	'http://geoportal1-ons.opendata.arcgis.com/datasets/df607d4ffa124cdca8317e3e63d45d78_2.geojson': 'NationalParks.json', //https://data.gov.uk/dataset/31c4e3b8-11bc-4eb9-be62-c281a3dc5c7f/national-parks-august-2016-generalised-clipped-boundaries-in-great-britain
};

function download() {
	return downloadFiles('nationalparks', urls);
}

ifCmd(module, download)

module.exports = download;
