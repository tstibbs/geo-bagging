import $ from 'jquery';
	export default leaflet.Class.extend({
		initialize: function (manager, constraintsView) {
			this._manager = manager;
			this._constraintsView = constraintsView;

			this._view = $('<div class="setting"></div>');
			var currentLocationLimitButton = $('<button type="button">Limit to 5 miles from current location</button>');
			currentLocationLimitButton.click(this._limitToCurrentLocation.bind(this));
			this._view.append(currentLocationLimitButton);
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
				this._constraintsView.limitTo(this, latLngBounds);
			}.bind(this);
			map.on('locationfound', listener);
			map.stopLocate();
			map.locate();
		},
		
		getView: function() {
			return this._view;
		},
		
		reset: function() {
			//nothing to do
		}
	});

