define(['leaflet', 'jquery', 'popup_view'],
	function(leaflet, $, popupView) {
	
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
			
			_parseDatas: function() {
				return this._data.features.map(function(feature) {
					return this.parse(feature);
				}.bind(this));
			},
			
			_translateDatas: function(layerDatas) {
				var layers = {};
				layerDatas.forEach(function(layerData) {
					var name = layerData.name;
					var url = layerData.url;
					var geojson = layerData.geojson;
					var extraInfos = layerData.extraInfos;
					
					var geoLayer = leaflet.geoJSON(geojson, {
						onEachFeature: function(feature, layer) {
							var popup = popupView.buildPopup(name, url, null, extraInfos);
							layer.bindPopup(popup);
						}.bind(this)
					});
					layers[name] = geoLayer;
				}.bind(this));
				return layers;
			},
			
			buildLayers: function() {
				var layerDatas = this._parseDatas();
				return this._translateDatas(layerDatas);
			},
			
			getBundleConfig: function() {
				return this._bundleConfig;
			},
			
			getAttribution: function() {
				return this._bundleConfig.attribution;
			}
		});

		return GeojsonLayer;
	}
);
