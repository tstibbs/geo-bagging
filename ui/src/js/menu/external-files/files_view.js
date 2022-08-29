import leaflet from 'VendorWrappers/leaflet.js'
import ExternalSourceLoader from '../../bundles/external-gpx/external-source-loader.js'

var FilesView = leaflet.Class.extend({
	initialize: function (manager, sourceName, colour) {
		this._manager = manager
		this._sourceName = sourceName
		this._colour = colour
		this._layers = {}
		this._externalSourceLoader = new ExternalSourceLoader(this._manager)
	},

	hideOldLayers: function () {
		//un-show the old layers
		this._externalSourceLoader.hideLayers(this._sourceName, this._layers)
	},

	showNewLayers: function (tracks) {
		//add the new layers
		let newLayers = Object.fromEntries(
			tracks.map(({features, name}) => {
				let geoJsonLayer = leaflet.geoJSON(features, {
					color: this._colour,
					onEachFeature: function (feature, layer) {
						if (feature.properties && feature.properties.name) {
							layer.bindPopup(feature.properties.name)
						}
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
