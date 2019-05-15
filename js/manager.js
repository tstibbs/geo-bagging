define([
	'jquery',
	'leaflet',
	'controls',
	'layers',
	'constants'
],
	function(
		$,
		leaflet,
		Controls,
		layersBuilder,
		constants
	) {
	
		//basic manager class that simplifies interoperation between other components
		return leaflet.Class.extend({
			initialize: function(map, config) {
				this._authenticated = false;//default
				this._initializePromise = $.get({
					url: constants.backendBaseUrl + 'isAuthenticated',
					xhrFields: {
						withCredentials: true
					}
				}).then(function(data) {
					if (data == false) {
						this._authenticated = false;
					} else {
						this._authenticated = true;
						this._loggedInUser = data.email;
					}
				}.bind(this)).fail(function(xhr, textError, error) {
					this._authenticated = false;
					console.error("Failed to check authentication status - this can be ignored unless trying to record visits: " + textError);
					console.log(error);
				}).always(function() {
					this._map = map;
					this._config = config;
					this._layers = layersBuilder(map, config);
					this._controls = new Controls(config, this._layers, map, this);
				}.bind(this));
			},
			
			waitForInitialization: function() {
				return this._initializePromise;
			},
			
			setViewConstraints: function(limitFunction) {
				this._limitFunction = limitFunction;//function(latLng) {return true or false}
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
			},
			
			setAuthenticated: function(/*boolean*/ authenticated) {
				this._authenticated = authenticated;
			},
			
			isAuthenticated: function() {
				return this._authenticated;
			},
			
			shouldManageVisits: function() {
				//currently just checks that we're authenticated
				return this.isAuthenticated();
			},
			
			getLoggedInUser: function() {
				return this._loggedInUser;
			}
		});
	}
);
