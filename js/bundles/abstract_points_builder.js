define(['leaflet'],
	function(leaflet) {
	
		var PointsBuilder = leaflet.Class.extend({
			initialize: function (config, bundleConfig) {
				this._markerList = null;
				this._config = config;
				this._bundleConfig = bundleConfig;
			},
			
			addMarker: function (lat, lng, url, name, extraTexts, icon, dimensionValues) {
				var latLng = [parseFloat(lat), parseFloat(lng)];
				if (this._config.markerConstraints == null || this._config.markerConstraints.contains(latLng)) {
					var marker = {
						latLng: latLng,
						name: name,
						extraTexts: extraTexts,
						exportName: name,
						url: url,
						icon: icon
					}
				
					if (this._config.dimensional_layering || dimensionValues == null || dimensionValues.length == 0) {
						if (this._markerList == null) {
							this._markerList = {};
						}
						var currentMap = this._markerList;
						for (var i = 0; i < dimensionValues.length - 1; i++) { // all but the last one
							var key = dimensionValues[i];
							if (currentMap[key] == null) {
								currentMap[key] = {};
							}
							currentMap = currentMap[key];
						}
						var lastKey = dimensionValues[dimensionValues.length - 1];
						if (currentMap[lastKey] == null) {
							currentMap[lastKey] = []; // set the last level to be an array
						}
						currentMap[lastKey].push(marker);
					} else {
						if (this._markerList == null) {
							this._markerList = [];
						}
						this._markerList.push(marker);
					}
				}
			},
			
			getMarkerList: function() {
				return this._markerList;
			},
			
			getBundleConfig: function() {
				return this._bundleConfig;
			}
		});

		return PointsBuilder;
	}
);
