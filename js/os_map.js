define(["leaflet", "layers", "config", "controls", "fullscreen_link"],
	function(leaflet, layers, Config, Controls, fullscreen_link) {
		var OsMap = leaflet.Class.extend({
			initialize: function (config) {
				this._config = config;
				// set up the map
				this._map = new leaflet.Map(this._config.map_element_id, {
					//these controls will be added by the controls module
					zoomControl: false,
					attributionControl: false
				});
				//add layers
				this._layers = layers(this._map, this._config);
				//set start point
				this._map.setView(new leaflet.LatLng(this._config.start_position[0], this._config.start_position[1]), this._config.initial_zoom);
				//add controls
				this._controls = new Controls(this._config, this._layers, this._map);
				
				fullscreen_link(this._map);
				
				//hook up listener to save the location when we move it
				this._map.on('zoomend moveend dragend', function() {
					this._saveLocation();
				}, this);
			},
			
			_saveLocation: function() {
				var center = this._map.getCenter();
				var start_position = [center.lat, center.lng];
				var initial_zoom = this._map.getZoom();
				if (localStorage !== undefined) {
					var hash = {
						start_position: start_position,
						initial_zoom: initial_zoom
					};
					this._config.persist(hash);
				}
			},

			getMap: function () {
				return this._map;
			},
			
			getControls: function() {
				return this._controls;
			},
			
			getLayers: function() {
				return this._layers;
			}
		});

		return OsMap;
	}
);
