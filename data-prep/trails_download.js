import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

const urls = {
	//title: National Trails
	//Org: Natural Resources Wales
	//licence: OGL
	//parent page: https://datamap.gov.wales/layers/inspire-nrw:NRW_NATIONAL_TRAIL/metadata_detail
	'https://datamap.gov.wales/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=inspire-nrw%3ANRW_NATIONAL_TRAIL&outputFormat=json&srs=EPSG%3A27700&srsName=EPSG%3A27700':
		'WalesNationalTrails.json',
	//title: Wales Coast Path
	//Org: Natural Resources Wales
	//licence: OGL
	//parent page: https://datamap.gov.wales/layers/inspire-nrw:NRW_WALES_COASTAL_PATH/metadata_detail
	'https://datamap.gov.wales/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=inspire-nrw%3ANRW_WALES_COASTAL_PATH&outputFormat=json&srs=EPSG%3A27700&srsName=EPSG%3A27700':
		'WalesCoastPath.json',
	//title: National Trails (England)
	//Org: Defra group ArcGIS Online organisation
	//licence: OGL
	//parent page: https://hub.arcgis.com/datasets/Defra::national-trails-england
	'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/National_Trails_England/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson':
		'National_Trails_England.geojson',
	//title: England Coast Path Route
	//Org: Defra group ArcGIS Online organisation
	//licence: OGL
	//parent page: https://environment.data.gov.uk/dataset/4006f956-f491-4ca9-ab01-d8c96e873165 / https://environment.data.gov.uk/geoservices/datasets/4006f956-f491-4ca9-ab01-d8c96e873165/ogc/features/v1/collections/England_Coast_Path_Route (would prefer to use the data from https://naturalengland-defra.opendata.arcgis.com/datasets/Defra::king-charles-iii-england-coast-path-route/about if it was available)
	'https://environment.data.gov.uk/geoservices/datasets/4006f956-f491-4ca9-ab01-d8c96e873165/ogc/features/v1/collections/England_Coast_Path_Route/items?f=application%2Fgeo%2Bjson&limit=50000':
		'England_Coast_Path_Route.geojson'
}

async function download() {
	return await downloadFiles('trails', urls)
}

await ifCmd(import.meta, download)

export default download
