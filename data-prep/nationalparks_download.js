import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

const urls = {
	//title: National Parks (December 2022) Boundaries GB BGC (V2)
	//description: This file contains the digital vector boundaries for National Parks, in Great Britain, as at December 2022. The boundaries available are: (BGC) Generalised (20m) - clipped to the coastline (Mean High Water mark).
	//Org: Office for National Statistics
	//licence: OGL
	//https://geoportal.statistics.gov.uk/datasets/ons::national-parks-december-2022-boundaries-gb-bgc-v2/explore
	'https://opendata.arcgis.com/api/v3/datasets/59cd36ff4dff47a5886ad1cc166ec05d_0/downloads/data?format=geojson&spatialRefId=4326&where=1%3D1':
		'NationalParks.json'
}

function download() {
	return downloadFiles('nationalparks', urls)
}

await ifCmd(import.meta, download)

export default download
