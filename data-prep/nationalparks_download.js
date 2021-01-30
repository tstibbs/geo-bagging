import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

const urls = {
	// https://opendata.arcgis.com/datasets/f41bd8ff39ce4a2393c2f454006ea60a_0.geojson -> http://geoportal1-ons.opendata.arcgis.com/datasets/f41bd8ff39ce4a2393c2f454006ea60a_0/data
	'https://opendata.arcgis.com/datasets/f41bd8ff39ce4a2393c2f454006ea60a_0.geojson': 'NationalParks.json'
}

function download() {
	return downloadFiles('nationalparks', urls)
}

ifCmd(import.meta, download)

export default download
