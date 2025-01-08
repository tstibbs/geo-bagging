import leaflet from 'VendorWrappers/leaflet.js'
import $ from 'jquery'
import PointsView from './points_view.js'
import GeojsonView from './geojson_view.js'
import AbstractPointsBuilder from './bundles/abstract_points_builder.js'
import AbstractGeojsonBuilder from './bundles/abstract_geojson_builder.js'
import UrlHandler from './utils/url_handler.js'

var ModelViews = leaflet.Class.extend({
	initialize: function (bundles, manager) {
		this._bundles = bundles
		this._manager = manager
		this._controls = manager.getControls()
		this._urlHandler = new UrlHandler()
		this._lazyCallbacks = {}
	},

	_filterModels: function (bundleModels, className) {
		var matchingModels = {}
		Object.keys(bundleModels)
			.filter(function (bundleName) {
				var model = bundleModels[bundleName]
				return model instanceof className
			})
			.forEach(function (bundleName) {
				matchingModels[bundleName] = bundleModels[bundleName]
			})
		return matchingModels
	},

	loadSource: function (bundleName) {
		return this._lazyCallbacks[bundleName]()
	},

	_addLazyModels: function (lazyModels, addCallback) {
		Object.keys(lazyModels).forEach(
			function (bundleName) {
				var model = lazyModels[bundleName]
				var callback = function () {
					return model.fetchData().done(
						function () {
							addCallback(bundleName, model)
							this._addAttribution(bundleName, model)
							this._urlHandler.sourceLoaded(bundleName)
						}.bind(this)
					)
				}.bind(this)
				this._lazyCallbacks[bundleName] = callback
				var meta = model.getMeta()
				var description = meta.recordCount + ' items (last updated ' + meta.lastUpdated + ')'
				var bundleDetails = this._bundles[bundleName]
				this._manager.getMatrixLayerControl().addLazyAspect(bundleName, bundleDetails, {
					description: description,
					callback: callback
				})
			}.bind(this)
		)
	},

	_addAttribution: function (bundleName, model) {
		var attribution = model.getAttribution()
		if (attribution != null && attribution.length > 0) {
			var dataSourceLabel = model.getBundleConfig().aspectLabel
			this._controls.addAttribution(dataSourceLabel, attribution)
		}
	},

	loadModelViews: function (bundleModels, lazyModels, config, callback) {
		var pointsModels = this._filterModels(bundleModels, AbstractPointsBuilder)
		var geojsonModels = this._filterModels(bundleModels, AbstractGeojsonBuilder)
		var lazyPointsModels = this._filterModels(lazyModels, AbstractPointsBuilder)
		var lazyGeojsonModels = this._filterModels(lazyModels, AbstractGeojsonBuilder)

		var pointsView = new PointsView(
			this._manager.getMap(),
			config,
			pointsModels,
			this._manager.getMatrixLayerControl(),
			this._controls,
			this._bundles,
			this._manager
		)
		var geojsonView = new GeojsonView(
			this._manager.getMap(),
			config,
			geojsonModels,
			this._manager.getMatrixLayerControl(),
			this._bundles
		)
		var promises = [pointsView.finish(), geojsonView.finish()]

		if (config.dimensional_layering) {
			this._addLazyModels(lazyPointsModels, function (bundleName, model) {
				pointsView.addClusteredModel(bundleName, model)
			})
			this._addLazyModels(lazyGeojsonModels, function (bundleName, model) {
				geojsonView.addClusteredModel(bundleName, model)
			})
		}

		$.when.apply($, promises).always(
			function () {
				if (config.dimensional_layering) {
					//override the basic layers control
					this._controls.addControl(this._manager.getMatrixLayerControl())
				}
				//add attribution texts
				Object.keys(bundleModels).forEach(
					function (aspect) {
						var model = bundleModels[aspect]
						this._addAttribution(aspect, model)
					}.bind(this)
				)
				callback()
			}.bind(this)
		)
	}
})

export default ModelViews
