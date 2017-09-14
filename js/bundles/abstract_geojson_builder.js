define(['leaflet', 'jquery'],
	function(leaflet, $) {
	
		var GeojsonLayer = leaflet.Class.extend({
			initialize: function (config, bundleConfig, bundleName) {
				this._markerList = null;
				this._config = config;
				this._bundleConfig = bundleConfig;
				this._bundleName = bundleName;
			},
			
			fetchData: function(urlPrefix) {
				var dataToLoad = urlPrefix + '/js/bundles/' + this._bundleName.substring(0, this._bundleName.lastIndexOf('/')) + '/' + this._bundleConfig.dataToLoad;
				return $.ajax({
					url: dataToLoad,
					dataType: 'json'
				}).done(function(data) {
					var features = data.features;
					var transformed = {};
					features.forEach(function(feature){
						var name = feature.properties.Name;
						transformed[name] = {
							"type": "FeatureCollection",
							"features": [feature]
						};
					});
					this._data = transformed;
				}.bind(this));
			},
			
			buildLayers: function() {
				var layers = {};
				Object.keys(this._data).forEach(function(layerName) {
					var layer = this._data[layerName];
					layers[layerName] = leaflet.geoJSON(layer);
				}.bind(this));
				return layers;
			},
			
			getBundleConfig: function() {
				return this._bundleConfig;
			},
			
			getAttribution: function() {
				return this._attributionText;//TODO
			}
		});

		return GeojsonLayer;
	}
);
