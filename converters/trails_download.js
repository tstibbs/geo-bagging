const fs = require('fs');
const ifCmd = require('./utils').doIfCmdCall;
const downloadFiles = require('./downloader').download;

const urls = {
	'http://lle.gov.wales/catalogue/item/NationalTrails.json': 'WalesNationalTrails.json', //http://lle.gov.wales/catalogue/item/NationalTrails/
	'http://lle.gov.wales/catalogue/item/WalesCoastPath.json': 'WalesCoastPath.json', //http://lle.gov.wales/catalogue/item/WalesCoastalPath/
	'https://opendata.arcgis.com/datasets/6a67e9afbcb646549be437fbff12d6ed_0.geojson': 'National_Trails_England.geojson', //http://naturalengland-defra.opendata.arcgis.com/datasets/national-trails-england
	'https://opendata.arcgis.com/datasets/a1488f928832407fbd267feb6802bed6_0.geojson': 'England_Coast_Path_Route.geojson' //http://naturalengland-defra.opendata.arcgis.com/datasets/england-coast-path-route
};

function download() {
	return downloadFiles('trails', urls);
}

ifCmd(module, download)

module.exports = download;
