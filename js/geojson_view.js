define(['jquery', 'leaflet'],
	function($, leaflet) {
	
		var PointsView = leaflet.Class.extend({
			initialize: function (map, config, modelsByAspect) {
				this._map = map;
				this._config = config;
				this._modelsByAspect = modelsByAspect;
			},
			
			finish: function (finished) {
				if (!this._config.dimensional_layering) {
					throw new Error("!dimensional_layering is not supported yet.");
				} else {
					var markerLists = Object.keys(this._modelsByAspect).forEach(function(aspect) {
						var model = this._modelsByAspect[aspect];
						model.addTo(this._map);
					}.bind(this));
				}
				//no async here, but stick to the convention of the other views
				return $.Deferred().resolve().promise();
			}
		});

		return PointsView;
	}
);
