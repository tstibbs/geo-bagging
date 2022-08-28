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
		//remove the old layers
		Object.values(this._layers).forEach(function (layer) {
			layer.remove()
		})
		//add the new layers
		this._layers = Object.fromEntries(
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
		this._externalSourceLoader.addLayers(sourceName, this._layers)
	}
})

export default TracksView
