import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

const urls = {
	//title: National Parks (Dec 2021) GB BGC
	//Org: Office for National Statistics
	//licence: OGL
	//homepage: https://geoportal.statistics.gov.uk/datasets/ons::national-parks-dec-2021-gb-bgc/
	'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/National_Parks_Dec_2021_GB_BGC_2022/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson':
		'NationalParks.geojson'
}

async function download() {
	return await downloadFiles('nationalparks', urls)
}
await ifCmd(import.meta, download)

export default download
