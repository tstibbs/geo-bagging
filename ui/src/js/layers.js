import leaflet from 'VendorWrappers/leaflet'
import LeafletBing from 'VendorWrappers/bing-layer'
import constants from './constants'

var defaults = {
	key: constants.bingKey
}
var bingDefaults = leaflet.extend({maxZoom: 18, minZoom: 0, detectRetina: true}, defaults)

//OS
var bingOsLayer = new LeafletBing(
	leaflet.extend(
		{
			imagerySet: 'OrdnanceSurvey',
			minZoom: 12,
			maxZoom: 18,
			maxNativeZoom: 17
		},
		defaults
	)
) //note OS doesn't support retina
//fallback layer because the OS maps don't scale well when you zoom out
var bingFallbackLayer = new LeafletBing(leaflet.extend({imagerySet: 'RoadOnDemand', maxZoom: 11, minZoom: 0}, defaults)) //note even though this layer supports retetina, having a group with a mix of retina and non-retina screws up the zooming
var bingOsGroup = leaflet.layerGroup([bingOsLayer, bingFallbackLayer])
//Bing standard maps
var bingRoads = new LeafletBing(leaflet.extend({imagerySet: 'RoadOnDemand'}, bingDefaults))
var bingHybrid = new LeafletBing(leaflet.extend({imagerySet: 'AerialWithLabelsOnDemand'}, bingDefaults))
var bingAerial = new LeafletBing(leaflet.extend({imagerySet: 'Aerial'}, bingDefaults))
//OSM
var osm = new leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	minZoom: 0,
	maxZoom: 19,
	attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
})

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
