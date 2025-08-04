import leaflet from 'VendorWrappers/leaflet.js'
import ExternalSourceLoader from '../../utils/external-source-loader.js'
import GeoJsonTranslator from '../../utils/geojson-translator.js'

var FilesView = leaflet.Class.extend({
	initialize: function (manager, sourceName, colour, initialOutlineWidth) {
		this._sourceName = sourceName
		this._layers = {}
		this._externalSourceLoader = new ExternalSourceLoader(manager)
		this._translator = new GeoJsonTranslator(manager, {color: colour, initialOutlineWidth})
	},

	hideOldLayers: function () {
		//un-show the old layers
		this._externalSourceLoader.hideLayers(this._sourceName, this._layers)
	},

	showNewLayers: function (files) {
		let layerData = files.map(({features, name}) => ({
			name,
			geojson: features
		}))
		let newLayers = this._translator.dataToLayers(layerData)
		this._externalSourceLoader.addLayers(this._sourceName, newLayers)
		this._layers = {...this._layers, ...newLayers}
	}
})

export default FilesView
