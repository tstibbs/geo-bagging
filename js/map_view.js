define([
	'leaflet',
	'jquery',
	'fullscreen_link',
	'mobile'
],
	function(
		leaflet,
		$,
		fullscreen_link,
		mobile
	) {
		return leaflet.Class.extend({
			initialize: function (config) {
				this._config = config;
				this._createView();
				// set up the map
				this._map = new leaflet.Map(this._config.map_element_id, {
					//these controls will be added by the controls module
					zoomControl: false
				});

				//set start point
				this._map.setView(new leaflet.LatLng(this._config.start_position[0], this._config.start_position[1]), this._config.initial_zoom);
				fullscreen_link(this._map);
				
				//hook up listener to save the location when we move it
				this._map.on('zoomend moveend dragend', function() {
					this._saveLocation();
				}, this);
			},
			
			//creates the html we need to display errors, loading screen and the map container
			_createView: function() {
				var content = '';
				
				var mapClass = '';
				if (this._config.map_style == 'mini' || this._config.map_style == 'mini_embedded') {
					mapClass = ' class="mini-map"';
				} else if (this._config.map_style == 'full') {
					mapClass = ' class="full-screen"';
				} else if (this._config.map_style == 'embedded') {
					mapClass = ' class="embedded-map"';
				}

				content+= 	'<div id="error-container" style="display: none;">';
				content+= 		'<p class="title">Some errors have occurred:</p>';
				content+= 		'<div id="errors-list"></div>';
				content+= 		'<a id="dismiss-button" href="#">Hide</a>';
				content+= 	'</div>';
				if (this._config.map_style == 'mini' || this._config.map_style == 'mini_embedded') {
					content+= 	'<div class="mini-map">';
				}
				content+= 		'<div id="loading-message-pane" class="full-screen">';
				content+= 			'<div class="loading-message-container">';
				content+= 				'<div class="loading-message-text">';
				content+= 					'<p>Loading...</p>';
				content+= 				'</div>';
				content+= 			'</div>';
				content+= 		'</div>';
				content+= 		'<div id="' + this._config.map_element_id + '"' + mapClass + '></div>';
				if (this._config.map_style == 'mini') {
					content+= 	'</div>';
					content+= 	'<div class="full-screen-link"></div>';
				}

				if (this._config.map_style == 'full') {
					this._config.map_outer_container_element.addClass('full-screen');
				}
				if (mobile.isMobile()) {
					this._config.map_outer_container_element.addClass('mobile');
				}
				this._config.map_outer_container_element.prepend($(content));
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
			}
		});
	}
);
