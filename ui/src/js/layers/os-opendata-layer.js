const apiKey = 'vWnckqIMRUgvAqfaN8jece3GEG3EGWZD'
import leaflet from 'VendorWrappers/leaflet.js'
import 'proj4'
import 'proj4leaflet'

//TODO do we need to include https://cdn.jsdelivr.net/gh/OrdnanceSurvey/os-api-branding@0.3.1/os-api-branding.js

// Setup the EPSG:27700 (British National Grid) projection.
export const crs = new leaflet.Proj.CRS(
	'EPSG:27700',
	'+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs',
	{
		resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75, 0.875, 0.4285, 0.21425],
		origin: [-238375.0, 1376256.0]
	}
)

// Define parameters object.
const params = {
	key: apiKey,
	service: 'WMTS',
	request: 'GetTile',
	version: '2.0.0',
	height: 256,
	width: 256,
	outputFormat: 'image/png',
	style: 'default',
	layer: 'Leisure_27700', //TODO we want to fall back to OSM when you zoom out, instead of the rubbish os zoomed out stuff
	tileMatrixSet: 'EPSG:27700',
	tileMatrix: '{z}',
	tileRow: '{y}',
	tileCol: '{x}'
}

// Construct query string parameters from object.
const queryString = Object.keys(params)
	.map(function (key) {
		return key + '=' + params[key]
	})
	.join('&')

export const osOpenDataLayer = L.tileLayer('https://api.os.uk/maps/raster/v1/wmts?' + queryString, {
	crs: crs,
	maxNativeZoom: 9
})
