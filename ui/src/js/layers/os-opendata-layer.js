import leaflet from 'VendorWrappers/leaflet.js'
import 'proj4'
import 'proj4leaflet'

import constants from '../constants.js'

// Setup the EPSG:27700 (British National Grid) projection.
export const crs = new leaflet.Proj.CRS(
	'EPSG:27700',
	'+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs',
	{
		resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75, 0.875, 0.4285, 0.21425],
		origin: [-238375.0, 1376256.0]
	}
)

const params = {
	key: constants.osOpenDataKey,
	service: 'WMTS',
	request: 'GetTile',
	version: '2.0.0',
	height: 256,
	width: 256,
	outputFormat: 'image/png',
	style: 'default',
	layer: 'Leisure_27700', //TODO the zoomed out imagery is not super clear, consider something else
	tileMatrixSet: 'EPSG:27700',
	tileMatrix: '{z}',
	tileRow: '{y}',
	tileCol: '{x}'
}
const queryString = Object.entries(params)
	.map(([key, val]) => `${key}=${val}`)
	.join('&')

export const osOpenDataLayer = leaflet.tileLayer('https://api.os.uk/maps/raster/v1/wmts?' + queryString, {
	crs: crs,
	maxNativeZoom: 9,
	attribution: 'Contains OS data &copy; Crown copyright and database rights ' + new Date().getFullYear()
})
