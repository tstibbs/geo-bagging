define(['leaflet'],
	function(leaflet) {
	
		var PointsBuilder = leaflet.Class.extend({
			initialize: function (config, bundleConfig) {
				this._markerList = null;
				this._config = config;
				this._bundleConfig = bundleConfig;
			},
			
			addMarkers: function(data) {
				var pointsToLoad = data.data;
				for (var i = 0; i < pointsToLoad.length; i++) {
					this.parse(pointsToLoad[i]);
				}
				if (this._bundleConfig.attribution != null) {
					this._attributionText = this._bundleConfig.attribution;
				} else {
					this._attributionText = data.attribution;
				}
			},
			
			addMarker: function (id, lat, lng, url, name, extraTexts, icon, dimensionValues) {
				var latLng = [parseFloat(lat), parseFloat(lng)];
				var marker = {
					id: id, // for filtering purposes
					latLng: latLng,
					name: name,
					extraTexts: extraTexts,
					exportName: name,
					url: url,
					icon: icon
				};
				
				if (this._config.markerConstraints == null || this._config.markerConstraints(marker)) {
					if (this._config.dimensional_layering || dimensionValues == null || dimensionValues.length === 0) {
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
			
			buildImageLinks: function(linksArray) {
				return linksArray.map(function(elem, index) {
					return ['Image ' + (index + 1), elem];
				});
			},
			
			getMarkerList: function() {
				return this._markerList;
			},
			
			getBundleConfig: function() {
				return this._bundleConfig;
			},
			
			getAttribution: function() {
				return this._attributionText;
			}
		});

		return PointsBuilder;
	}
);
