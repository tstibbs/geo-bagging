import leaflet from 'VendorWrappers/leaflet.js'
import popupView from '../popup_view.js'

const selectedOutlineWidth = 3

var GeoJsonTranslator = leaflet.Class.extend({
	initialize: function (manager, colour, initialOutlineWidth) {
		this._manager = manager
		this._colour = colour
		this._initialOutlineWidth = initialOutlineWidth
	},

	_showAsSelected: function (layer) {
		// check first if we _can_ style, as some layers can be things like Marker objects which
		// don't have a setStyle function - this feels hacky but that's what they do in leaflet
		// (see https://github.com/Leaflet/Leaflet/blob/5e9e3c74902af8fbd834e483870c838a9d436e49/src/layer/GeoJSON.js#L156)
		if (layer.setStyle) {
			layer.setStyle({
				weight: selectedOutlineWidth
			})
		}
	},

	_extractName: function (feature) {
		if (feature && feature.properties && feature.properties.name) {
			return feature.properties.name
		} else {
			return null
		}
	},

	dataToLayers: function (layerDatas) {
		//add the new layers
		let newLayers = Object.fromEntries(
			layerDatas.map(layerData => {
				const {name, url, geojson, extraInfos} = layerData
				const nameToFeatures = {}
				const onFeatureClick = e => {
					let layer = e.target
					this._showAsSelected(layer)
					let name = this._extractName(layer.feature)
					if (name) {
						let layers = nameToFeatures[name]
						if (layer != null) {
							layers.forEach(this._showAsSelected)
						}
					}
				}
				let geoJsonLayer = leaflet.geoJSON(geojson, {
					weight: this._initialOutlineWidth, //stroke width in pixels - aka border width
					color: this._colour,
					onEachFeature: (feature, layer) => {
						let name = this._extractName(feature)
						if (name) {
							var visited = null //not supported on geojson sources for now
							var popup = popupView.buildPopup(this._manager, name, url, null, extraInfos, visited)
							layer.bindPopup(popup)
							if (!(name in nameToFeatures)) {
								nameToFeatures[name] = []
							}
							nameToFeatures[name].push(layer)
						}
						layer.on({
							click: onFeatureClick
						})
					}
				})
				//reset all styles when the map is clicked anywhere. Style will be re-added if it is one of these features that is clicked (same way the popups work)
				this._manager.getMap().on({
					preclick: () => {
						geoJsonLayer.resetStyle()
					}
				})
				return [name, geoJsonLayer]
			})
		)
		return newLayers
	}
})

export default GeoJsonTranslator
