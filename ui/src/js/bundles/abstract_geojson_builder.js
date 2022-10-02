import AbstractBundleBuilder from './abstract_bundle_builder.js'
import GeoJsonTranslator from '../utils/geojson-translator.js'

const colour = '#3388ff'

var GeojsonLayer = AbstractBundleBuilder.extend({
	initialize: function (manager, bundleConfig, bundleName) {
		AbstractBundleBuilder.prototype.initialize.call(this, manager, bundleConfig, bundleName)
		this._data = null
		this._bundleConfig = bundleConfig
		this._translator = new GeoJsonTranslator(manager, colour, bundleConfig.initialOutlineWidth)
	},

	fetchData: function () {
		return this._doFetchData().done(
			function (data) {
				this._data = data
			}.bind(this)
		)
	},

	_parseDatas: function () {
		return this._data.features.map(
			function (feature) {
				return this.parse(feature)
			}.bind(this)
		)
	},

	buildLayers: function () {
		var layerDatas = this._parseDatas()
		return this._translator.dataToLayers(layerDatas)
	},

	getAttribution: function () {
		return this._bundleConfig.attribution
	}
})

export default GeojsonLayer
