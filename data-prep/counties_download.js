import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

const urls = {
	//title: Counties and Unitary Authorities (May 2023) Boundaries UK BGC
	//Org: Office for National Statistics
	//licence: OGL
	//homepage: https://open-geography-portalx-ons.hub.arcgis.com/datasets/ons::counties-and-unitary-authorities-may-2023-boundaries-uk-bgc
	'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Counties_and_Unitary_Authorities_May_2023_UK_BGC/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson':
		'UK-counties.geojson',
	//
	//title: Counties - National Statutory Boundaries - 2019
	//Org: Tailte Éireann
	//licence: CC BY 4.0
	//homepage: https://www.geohive.ie/datasets/e6f6418eb62442c4adbe18d0a64135a2_0/
	// 'https://hub.arcgis.com/api/download/v1/items/e6f6418eb62442c4adbe18d0a64135a2/geojson?redirect=false&layers=0&spatialRefId=4326': 'RoI-counties.geojson'
	'https://services-eu1.arcgis.com/FH5XCsx8rYXqnjF5/arcgis/rest/services/Counties___OSi_National_Statutory_Boundaries/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson':
		'RoI-counties.geojson'
}

async function download() {
	return await downloadFiles('counties', urls)
}
await ifCmd(import.meta, download)

export default download
