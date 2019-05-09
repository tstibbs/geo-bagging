define(['./abstract_bundle_builder'],
	function(AbstractBundleBuilder) {
	
		var PointsBuilder = AbstractBundleBuilder.extend({
			initialize: function (manager, bundleConfig, bundleName, urlPrefix) {
				AbstractBundleBuilder.prototype.initialize.call(this, manager, bundleConfig, bundleName, urlPrefix);
				this._markerList = null;
				this._bundleConfig = bundleConfig;
			},
			
			fetchData: function(urlPrefix) {
				return this._doFetchData(urlPrefix).done(function(data) {
					this.addMarkers(data);
				}.bind(this));
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
			
			addMarker: function (id, lat, lng, url, name, extraTexts, icon, dimensionValues, layerId) {
				var latLng = [parseFloat(lat), parseFloat(lng)];
				var visited = this.getVisits().includes(id);
				var marker = {
					id: id, // for filtering purposes
					latLng: latLng,
					name: name,
					extraTexts: extraTexts,
					exportName: name,
					url: url,
					icon: icon,
					layerId: layerId,
					visited: visited
				};
				
				if (this._config.dimensional_layering || dimensionValues == null || dimensionValues.length === 0) {
					if (this._markerList == null) {
						this._markerList = {};
					}
						
					if (this._withinConstraints(marker)) {
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
					}
				} else {
					if (this._markerList == null) {
						this._markerList = [];
					}
					this._markerList.push(marker);
				}
			},
			
			_withinConstraints: function(marker) {
				var matcher = this._manager.getViewConstraints();
				return matcher == null || matcher(marker.latLng);
			},
			
			buildImageLinks: function(linksArray) {
				return linksArray.map(function(elem, index) {
					return ['Image ' + (index + 1), elem];
				});
			},
				
			split: function(values, labels) {
				return values.split(';').map(function(value) {
					var label = labels[value];
					return label != null ? label : value;
				});
			},
			
			getMarkerList: function() {
				return this._markerList;
			},
			
			getAttribution: function() {
				return this._attributionText;
			}
		});

		return PointsBuilder;
	}
);
