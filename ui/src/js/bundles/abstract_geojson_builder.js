import leaflet from 'VendorWrappers/leaflet'
import AbstractBundleBuilder from './abstract_bundle_builder'
import popupView from '../popup_view'

var GeojsonLayer = AbstractBundleBuilder.extend({
	initialize: function (manager, bundleConfig, bundleName, urlPrefix) {
		AbstractBundleBuilder.prototype.initialize.call(
			this,
			manager,
			bundleConfig,
			bundleName,
			urlPrefix
		)
		this._data = null
		this._bundleConfig = bundleConfig
	},

	fetchData: function (urlPrefix) {
		return this._doFetchData(urlPrefix).done(
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

	_translateDatas: function (layerDatas) {
		var layers = {}
		layerDatas.forEach(
			function (layerData) {
				var name = layerData.name
				var url = layerData.url
				var geojson = layerData.geojson
				var extraInfos = layerData.extraInfos

				var geoLayer = leaflet.geoJSON(geojson, {
					onEachFeature: function (feature, layer) {
						var visited = null //not supported on geojson sources for now
						var popup = popupView.buildPopup(
							this._manager,
							name,
							url,
							null,
							extraInfos,
							visited
						)
						layer.bindPopup(popup)
					}.bind(this)
				})
				layers[name] = geoLayer
			}.bind(this)
		)
		return layers
	},

	buildLayers: function () {
		var layerDatas = this._parseDatas()
		return this._translateDatas(layerDatas)
	},

	getAttribution: function () {
		return this._bundleConfig.attribution
	}
})

export default GeojsonLayer
