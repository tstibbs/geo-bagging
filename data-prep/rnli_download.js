import {ifCmd, writeFile} from './utils.js';
import constants from './constants.js';
import { download as downloadFiles } from './downloader.js';
import wtfWikipedia from "wtf_wikipedia";
const inputDir = `${constants.tmpInputDir}/rnli`;

function downloadStationsList() {
	const urls = {
		'https://opendata.arcgis.com/datasets/7dad2e58254345c08dfde737ec348166_0.csv': 'lifeboatStations.csv' //https://hub.arcgis.com/datasets/7dad2e58254345c08dfde737ec348166_0
	};
	return downloadFiles('rnli', urls);
}

async function downloadEnrichingData() {
	let data = await wtfWikipedia.fetch("List_of_RNLI_stations", "en", constants.wikipediaOptions)
	let dataString = JSON.stringify(data, null, 2);
	await writeFile(`${inputDir}/wiki.json`, dataString);
}

function download() {
	let p1 = downloadStationsList();
	let p2 = downloadEnrichingData();
	return Promise.all([p1, p2]);
}

ifCmd(import.meta, download)

export default download;
