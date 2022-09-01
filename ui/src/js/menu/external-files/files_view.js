import leaflet from 'VendorWrappers/leaflet.js'
import ExternalSourceLoader from '../../bundles/external-gpx/external-source-loader.js'

const initialOutlineWidth = 1
const selectedOutlineWidth = 3

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
		const onFeatureClick = e => {
			let layer = e.target
			layer.setStyle({
				weight: selectedOutlineWidth
			})
		}
		//add the new layers
		let newLayers = Object.fromEntries(
			tracks.map(({features, name}) => {
				let geoJsonLayer = leaflet.geoJSON(features, {
					weight: initialOutlineWidth, //stroke width in pixels - aka border width
					color: this._colour,
					onEachFeature: function (feature, layer) {
						if (feature.properties && feature.properties.name) {
							layer.bindPopup(feature.properties.name)
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
