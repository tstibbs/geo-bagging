import {ifCmd} from '../shared/utils.js'
import {writeFile} from './utils.js'
import {fetchPages} from './wikiUtils.js'
import {tmpInputDir} from './constants.js'
import {download as downloadFiles} from './downloader.js'
const inputDir = `${tmpInputDir}/rnli`

function downloadStationsList() {
	const urls = {
		'https://opendata.arcgis.com/datasets/7dad2e58254345c08dfde737ec348166_0.csv': 'lifeboatStations.csv' //https://hub.arcgis.com/datasets/7dad2e58254345c08dfde737ec348166_0
	}
	return downloadFiles('rnli', urls)
}

async function downloadEnrichingData() {
	let data = await fetchPages(['List_of_RNLI_stations'])
	let dataString = JSON.stringify(data, null, 2)
	await writeFile(`${inputDir}/wiki.json`, dataString)
}

async function download() {
	let p1 = downloadStationsList()
	let p2 = downloadEnrichingData()
	await Promise.all([p1, p2])
}

ifCmd(import.meta, download)

export default download
