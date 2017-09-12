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
				if (!this._config.dimensional_layering) {
					throw new Error("!dimensional_layering is not supported yet.");
				} else {
					var markerLists = Object.keys(this._modelsByAspect).forEach(function(aspect) {
						var model = this._modelsByAspect[aspect];
						var layer = model.buildLayer();
						var label = model.getBundleConfig().displayLabel
						layer.addTo(this._map)
						this._matrixLayerControl.addOverlay(layer, label);
					}.bind(this));
				}
				//no async here, but stick to the convention of the other views
				return $.Deferred().resolve().promise();
			}
		});

		return GeojsonView;
	}
);
