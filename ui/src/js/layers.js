import leaflet from 'VendorWrappers/leaflet.js'
import constants from './constants.js'
import {osOpenDataLayer} from './layers/os-opendata-layer.js'

const minOverallZoom = 1
const maxOverallZoom = 19

//because we have a mix of zooms, we have to either change the maxZoom value on the main map whenever we change layer, or we have to set the min and max the same for each layer(/layergroup). The latter is simpler, but means we have to set maxNativeZoom for those sources which can't provide tiles at the max overall zoom level. However, setting detectRetina=true breaks this, as per https://github.com/Leaflet/Leaflet/issues/8850
//thus, we disable detectRetina in all sources to ensure that the maxNativeZoom property is correctly obeyed :(

var defaults = {
	minZoom: minOverallZoom,
	maxZoom: maxOverallZoom,
	detectRetina: false
}

//OSM
var osm = new leaflet.TileLayer(
	'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	leaflet.extend({}, defaults, {
		attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
	})
)

const mapTilerAttribution = `\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e`
const mapTilerUrl = `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.png?key=${constants.mapTilerKey}`
const mapTilerSatellite = new leaflet.TileLayer(mapTilerUrl, {
	...defaults,
	tileSize: 512,
	zoomOffset: -1,
	maxNativeZoom: 18,
	attribution: mapTilerAttribution,
	crossOrigin: true
})

//map of display name to layer details
var layers = {
	'OS Maps (beta)': {
		layer: osOpenDataLayer,
		id: 'os-open-data'
	},
	'Open Street Map': {
		layer: osm,
		id: 'OSM'
	},
	Satellite: {
		layer: mapTilerSatellite,
		id: 'Satellite'
	}
}

function _listenForLayerChange(id, layer, config) {
	layer.on(
		'add',
		function () {
			config.persist({defaultLayer: id})
		}.bind(this)
	)
}

var LayerAdder = function (map, config) {
	//TODO there's a bug here where if we select the wrong layer somehow then the zoom could be all wrong because the zoom levels are not equivalent between layers
	var layerToSelect = Object.values(layers).find(layer => layer.id === config.defaultLayer)
	if (layerToSelect == null) {
		layerToSelect = osm //default to OSM if no layer is selected
	} else {
		layerToSelect = layerToSelect.layer
	}
	layerToSelect.addTo(map)
	//I'm not totally convinced we should need to do this
	//the alternative is to set the CRS on the map based on what layer is being loaded initially
	map.fire('baselayerchange', {
		layer: layerToSelect
	})

	//set up listener to persist which layer is selected
	Object.values(layers).forEach(({id, layer}) => {
		_listenForLayerChange(id, layer, config)
	})

	return Object.fromEntries(Object.entries(layers).map(([displayName, {layer}]) => [displayName, layer]))
}

export default LayerAdder
export {maxOverallZoom, minOverallZoom}
