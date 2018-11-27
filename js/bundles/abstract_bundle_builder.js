define(['leaflet', 'jquery'],
	function(leaflet, $) {
		var AbstractBundleBuilder = leaflet.Class.extend({
			initialize: function (manager, bundleConfig, bundleName, urlPrefix) {
				this._markerList = null;
				this._manager = manager;
				this._config = manager.getConfig();
				this._bundleConfig = bundleConfig;
				this._bundleName = bundleName.indexOf('/') == -1 ? bundleName : bundleName.substring(0, bundleName.lastIndexOf('/'));
				this._urlPrefix = urlPrefix;
			},
			
			_buildDataUrl: function() {
				return this._urlPrefix + '/js/bundles/' + this._bundleName + '/' + this._bundleConfig.dataToLoad;
			},
			
			_doFetchData: function() {
				var dataToLoad = this._buildDataUrl();
				return $.ajax({
					url: dataToLoad,
					dataType: 'json'
				}).fail(function(xhr, textError, error) {
					console.error("Failed to load map data: " + textError);
					console.log(error);
				});
			},
			
			fetchMeta: function() {
				var dataToLoad = this._buildDataUrl() + '.meta';
				return $.ajax({
					url: dataToLoad,
					dataType: 'json'
				}).fail(function(xhr, textError, error) {
					console.error("Failed to load source metadata: " + textError);
					console.log(error);
				}).done(function(data) {
					this._meta = data;
				}.bind(this));
			},
			
			getMeta: function() {
				return this._meta;
			},
			
			getBundleConfig: function() {
				return this._bundleConfig;
			}
		});
		return AbstractBundleBuilder;
	}
);
