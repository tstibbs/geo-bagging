import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

const urls = {
	//title: National Parks (December 2022) GB BGC
	//description: (BGC) Generalised (20m) - clipped to the coastline (Mean High Water mark).
	//Org: Office for National Statistics
	//licence: OGL
	//https://geoportal.statistics.gov.uk/datasets/ons::national-parks-december-2022-gb-bgc-2/explore
	'https://opendata.arcgis.com/api/v3/datasets/f7e58d429d0f40c18ca8f6e5933b77e5_0/downloads/data?format=geojson&spatialRefId=4326&where=1%3D1':
		'NationalParks.json'
}

function download() {
	return downloadFiles('nationalparks', urls)
}

await ifCmd(import.meta, download)

export default download
