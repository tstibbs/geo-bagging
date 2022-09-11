import leaflet from 'VendorWrappers/leaflet.js'
import ExternalSourceLoader from '../../bundles/external-gpx/external-source-loader.js'

const selectedOutlineWidth = 3

var FilesView = leaflet.Class.extend({
	initialize: function (manager, sourceName, colour, initialOutlineWidth) {
		this._manager = manager
		this._sourceName = sourceName
		this._colour = colour
		this._initialOutlineWidth = initialOutlineWidth
		this._layers = {}
		this._externalSourceLoader = new ExternalSourceLoader(this._manager)
	},

	hideOldLayers: function () {
		//un-show the old layers
		this._externalSourceLoader.hideLayers(this._sourceName, this._layers)
	},

	_showAsSelected: function (layer) {
		layer.setStyle({
			weight: selectedOutlineWidth
		})
	},

	_extractName: function (feature) {
		if (feature && feature.properties && feature.properties.name) {
			return feature.properties.name
		} else {
			return null
		}
	},

	showNewLayers: function (tracks) {
		//add the new layers
		let newLayers = Object.fromEntries(
			tracks.map(({features, name}) => {
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
				let geoJsonLayer = leaflet.geoJSON(features, {
					weight: this._initialOutlineWidth, //stroke width in pixels - aka border width
					color: this._colour,
					onEachFeature: (feature, layer) => {
						let name = this._extractName(feature)
						if (name) {
							layer.bindPopup(name)
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
		this._externalSourceLoader.addLayers(this._sourceName, newLayers)
		this._layers = {...this._layers, ...newLayers}
	}
})

export default FilesView
