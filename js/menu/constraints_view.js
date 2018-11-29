define(['jquery', 'leaflet'],
	function($, leaflet) {
		return leaflet.Class.extend({
			initialize: function(manager) {
				this._manager = manager;
				this._view = $('<div></div>');
				var info = $('<div class="info">This section allows you to limit how much data is displayed on screen. This can be useful for example when on older or mobile devices which may struggle to remain responsive if a large amount of data is loaded.</div>')
				this._view.append(info);
				this._view.append('<hr class="info">');
				
				var currentAreaView = this._buildCurrentAreaView();
				this._view.append(currentAreaView);
				
				var currentLocationView = this._buildCurrentLocationView();
				this._view.append(currentLocationView);
			},
			
			_buildCurrentAreaView: function() {
				var wrapper = $('<div class="setting"></div>');
				this._currentAreaLimit = $('<input type="checkbox">');
				var desc = $('<label>Limit new markers to current area</label>');
				desc.prepend(this._currentAreaLimit);
				
				this._currentAreaLimit.change(function(event) {
					if (event.target.checked) {
						this._limitToCurrentView();
					} else {
						this._unlimit();
					}
				}.bind(this));
				
				wrapper.append(desc);
				return wrapper;
			},
			
			_buildCurrentLocationView: function() {
				var wrapper = $('<div class="setting"></div>');
				var currentLocationLimitButton = $('<button type="button">Limit to 5 miles from current location</button>');
				currentLocationLimitButton.click(this._limitToCurrentLocation.bind(this));
				wrapper.append(currentLocationLimitButton);
				return wrapper;
			},
			
			_limitToCurrentLocation: function() {
				var map = this._manager.getMap();
				var listener = function(e) {
					map.off('locationfound', listener);//only want to be called once
					var lat = e.latlng.lat;
					var lng = e.latlng.lng;
					var latExtra = 0.08;//roughly 5 miles difference in lattitude in the UK
					var lngExtra = 0.12;//roughly 5 miles difference in longitude in the UK
					var latLngBounds = new leaflet.latLngBounds(
						[lat + latExtra, lng + lngExtra],
						[lat - latExtra, lng - lngExtra]
					);
					this._limitTo(latLngBounds);
				}.bind(this);
				map.on('locationfound', listener);
				map.stopLocate();
				map.locate();
			},
			
			_limitToCurrentView: function() {
				this._limitTo(this._manager.getMap().getBounds());
			},
			
			_limitTo: function(bounds) {
				this._manager.setViewConstraints(bounds);
			},
			
			_unlimit: function() {
				this._manager.setViewConstraints(null);
				this._currentAreaLimit.prop('checked', false);
			},
			
			getView: function() {
				return this._view;
			}
		});
	}
);
