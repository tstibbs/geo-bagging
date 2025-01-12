import leaflet from 'VendorWrappers/leaflet.js'
import LeafletBing from 'VendorWrappers/bing-layer.js'
import constants from './constants.js'
const minOverallZoom = 1
const maxOverallZoom = 19

//because we have a mix of zooms, we have to either change the maxZoom value on the main map whenever we change layer, or we have to set the min and max the same for each layer(/layergroup). The latter is simpler, but means we have to set maxNativeZoom for those sources which can't provide tiles at the max overall zoom level. However, setting detectRetina=true breaks this, as per https://github.com/Leaflet/Leaflet/issues/8850
//thus, we disable detectRetina in all sources to ensure that the maxNativeZoom property is correctly obeyed :(

var defaults = {
	minZoom: minOverallZoom,
	maxZoom: maxOverallZoom,
	detectRetina: false
}
var bingDefaults = leaflet.extend({}, defaults, {
	key: constants.bingKey,
	maxNativeZoom: 18
})

//Bing standard maps
var bingRoads = new LeafletBing(leaflet.extend({}, bingDefaults, {imagerySet: 'RoadOnDemand'}))
var bingHybrid = new LeafletBing(leaflet.extend({}, bingDefaults, {imagerySet: 'AerialWithLabelsOnDemand'}))
var bingAerial = new LeafletBing(leaflet.extend({}, bingDefaults, {imagerySet: 'Aerial'}))

//OS
var bingOsLayer = new LeafletBing(
	leaflet.extend({}, bingDefaults, {
		imagerySet: 'OrdnanceSurvey',
		minZoom: 12,
		maxNativeZoom: 17
	})
) //note OS doesn't support retina
//fallback layer because the OS maps don't scale well when you zoom out
var bingFallbackLayer = new LeafletBing(
	leaflet.extend({}, bingDefaults, {
		imagerySet: 'RoadOnDemand',
		maxZoom: 11
	})
)
var bingOsGroup = leaflet.layerGroup([bingOsLayer, bingFallbackLayer])

//OSM
var osm = new leaflet.TileLayer(
	'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	leaflet.extend({}, defaults, {
		attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
	})
)

var layers = {
	OS: bingOsGroup,
	'Bing Roads': bingRoads,
	'Bing Satellite': bingAerial,
	'Bing Hybrid': bingHybrid,
	OSM: osm
}

function _listenForLayerChange(layerId, layer, config) {
	layer.on(
		'add',
		function () {
			config.persist({defaultLayer: layerId})
		}.bind(this)
	)
}

var LayerAdder = function (map, config) {
	//if we have a default layer set, select that now
	var layerToSelect = layers[config.defaultLayer]
	if (layerToSelect != null) {
		layerToSelect.addTo(map)
	} else {
		bingOsGroup.addTo(map)
	}

	//set up listener to persist which layer is selected
	for (var id in layers) {
		_listenForLayerChange(id, layers[id], config)
	}

	return layers
}

export default LayerAdder
export {maxOverallZoom, minOverallZoom}
