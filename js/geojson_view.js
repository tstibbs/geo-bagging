define(['jquery', 'leaflet'],
	function($, leaflet) {
	
		var GeojsonView = leaflet.Class.extend({
			initialize: function (map, config, modelsByAspect, matrixLayerControl) {
				this._map = map;
				this._config = config;
				this._modelsByAspect = modelsByAspect;
				this._matrixLayerControl = matrixLayerControl;
			},
			
			finish: function (finished) {
				if (!this._config.dimensional_layering && Object.keys(this._modelsByAspect).length > 0) {
					throw new Error("!dimensional_layering is not supported yet.");
				} else {
					var parentGroup = leaflet.layerGroup();
					var markerLists = Object.keys(this._modelsByAspect).forEach(function(aspect) {
						var aspectOptions = this._config.bundles[aspect];//will have other options, but collisions are unlikely
						
						var model = this._modelsByAspect[aspect];
						var layers = model.buildLayers();
						Object.values(layers).forEach(function(layer) {
							layer.addTo(this._map)
						}.bind(this));
						this._matrixLayerControl.addAspect(aspect, layers, aspectOptions);
					}.bind(this));
				}
				//no async here, but stick to the convention of the other views
				return $.Deferred().resolve().promise();
			}
		});

		return GeojsonView;
	}
);
