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
					this._data = data;
				}.bind(this));
			},
			
			addTo: function(map) {
				leaflet.geoJSON(this._data).addTo(map);
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
