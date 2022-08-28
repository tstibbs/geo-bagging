import leaflet from 'VendorWrappers/leaflet.js'
import ExternalSourceLoader from '../../bundles/external-gpx/external-source-loader.js'

const sourceName = 'GPX Files'

var TracksView = leaflet.Class.extend({
	initialize: function (manager) {
		this._manager = manager
		this._colour = '#FF0000'
		this._layers = {}
		this._externalSourceLoader = new ExternalSourceLoader(this._manager)
	},

	showTracks: function (tracks) {
		//un-show the old layers
		this._externalSourceLoader.hideLayers(sourceName, this._layers)
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
		this._externalSourceLoader.addLayers(sourceName, newLayers)
		this._layers = {...this._layers, ...newLayers}
	}
})

export default TracksView
