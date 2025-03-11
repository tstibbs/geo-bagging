import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet.js'

var GeojsonView = leaflet.Class.extend({
	initialize: function (manager, map, config, modelsByAspect, matrixLayerControl, bundles) {
		this._manager = manager
		this._map = map
		this._config = config
		this._modelsByAspect = modelsByAspect
		this._matrixLayerControl = matrixLayerControl
		this._bundles = bundles
	},

	finish: function (finished) {
		if (!this._config.dimensional_layering && Object.keys(this._modelsByAspect).length > 0) {
			throw new Error('!dimensional_layering is not supported yet.')
		} else {
			var parentGroup = leaflet.layerGroup()
			var markerLists = Object.keys(this._modelsByAspect).forEach(
				function (aspect) {
					var model = this._modelsByAspect[aspect]
					this.addClusteredModel(aspect, model)
				}.bind(this)
			)
		}
		//no async here, but stick to the convention of the other views
		return $.Deferred().resolve().promise()
	},

	addClusteredModel: function (aspect, model) {
		var aspectOptions = this._bundles[aspect] //will have other options, but collisions are unlikely
		var layers = model.buildLayers()
		Object.values(layers).forEach(
			function (layer) {
				layer.addTo(this._map)
			}.bind(this)
		)
		aspectOptions = this._manager.getVisitConstraintManager().translateAspect(aspectOptions, model.getBundleName())
		this._matrixLayerControl.addAspect(aspect, layers, aspectOptions)
	}
})

export default GeojsonView
