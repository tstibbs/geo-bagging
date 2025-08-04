import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

const urls = {
	//title: Counties and Unitary Authorities (May 2023) Boundaries UK BGC
	//Org: Office for National Statistics
	//licence: OGL
	//homepage: https://open-geography-portalx-ons.hub.arcgis.com/datasets/ons::counties-and-unitary-authorities-may-2023-boundaries-uk-bgc
	'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Counties_and_Unitary_Authorities_May_2023_UK_BGC/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson':
		'UK-counties.geojson'
}

async function download() {
	return await downloadFiles('counties', urls)
}
await ifCmd(import.meta, download)

export default download
