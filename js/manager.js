define([
	'jquery',
	'leaflet',
	'controls',
	'layers'
],
	function(
		$,
		leaflet,
		Controls,
		layersBuilder
	) {
	
		//basic manager class that simplifies interoperation between other components
		return leaflet.Class.extend({
			initialize: function (map, config) {
				this._map = map;
				this._config = config;
				this._layers = layersBuilder(map, config);
				this._controls = new Controls(config, this._layers, map, this);
			},
			
			setViewConstraints: function (bounds) {
				var limit = leaflet.latLngBounds(bounds);
				this._limitFunction = function(latLng) {
					return limit.contains(latLng);
				};
			},
			
			getViewConstraints: function() {
				return this._limitFunction;
			},
			
			getControls: function() {
				return this._controls;
			},
			
			getMap: function() {
				return this._map;
			},
			
			getLayers: function() {
				return this._layers;
			},
			
			getConfig: function() {
				return this._config;
			}
		});
	}
);
