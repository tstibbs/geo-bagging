define(["leaflet", "os_map", "points_view", "config", "params", "conversion", "jquery", 'bundles/trigs/config_base'],
	function(leaflet, OsMap, PointsView, Config, params, conversion, $, trigsPointsBundle) {
			
		function finish() {
			$('div#loading-message-pane').hide();
		}
		
		return {
			_buildMap: function(options, bundles) {
				this._config = new Config(options, bundles);
				this._osMap = new OsMap(this._config);
				this._pointsModels = {};
			},
			
			hasUrlData: function() {
				return params('trigs') != null;
			},
			
			buildMapFromUrl: function(options) {
				this._buildMap(options, {trigs: trigsPointsBundle});
				var pointsModel = new trigsPointsBundle.parser(this._config, trigsPointsBundle);
				var locationsFromUrl = params('trigs');
				var allPoints = locationsFromUrl.split(";");
				for (var i = 0; i < allPoints.length; i++) {
					var point = allPoints[i].split(',');
					var lngLat = conversion.osgbToLngLat(point[0], point[1]);
					pointsModel.add(lngLat, point[2], point[3]);
				}
				this._pointsModels.trigs = pointsModel;
				this._finishLoading();
			},
			
			buildMapWithDummyData: function(options) {
				this._buildMap(options, {trigs: trigsPointsBundle});
				//dummy data as an example
				var pointsModel = new trigsPointsBundle.parser(this._config, trigsPointsBundle);
				pointsModel.add(conversion.osgbToLngLat(418678, 385093), 'http://trigpointing.uk/trig/6995', 'Winhill Pike');
				pointsModel.add(conversion.osgbToLngLat(422816, 385344), 'http://trigpointing.uk/trig/3795', 'High Neb');
				pointsModel.add(conversion.osgbToLngLat(419762, 390990), 'http://trigpointing.uk/trig/949', 'Back Tor');
				pointsModel.add(conversion.osgbToLngLat(412927, 387809), 'http://trigpointing.uk/trig/3019', 'Edale Moor');
				this._pointsModels.trigs = pointsModel;
				this._finishLoading();
			},
			
			buildMapWithBundleDatas: function(options, bundles) {
				var bundleDataPrefix = ((params('remoteData') == 'true') ? 'https://rawgit.com/tstibbs/os-map/hills' : '..');//some mobile browsers don't support local ajax, so this provides a workaround for dev on mobile devices.
				this._buildMap(options, bundles);
				var promises = [];
				Object.keys(bundles).forEach(function(bundleName) {
					var bundle = bundles[bundleName];
					var dataToLoad = bundleDataPrefix + '/js/bundles/' + bundleName.substring(0, bundleName.lastIndexOf('/')) + '/' + bundle.dataToLoad;
					var ajaxRequest = $.ajax({
						url: dataToLoad,
						dataType: 'json'
					}).fail(function(xhr, textError, error) {
						console.error("Failed to load map data: " + textError);
						console.log(error);
					}).done(function(data) {
						var pointsToLoad = data.data;
						var pointsModel = new bundle.parser(this._config, bundle);
						for (var i = 0; i < pointsToLoad.length; i++) {
							pointsModel.parse(pointsToLoad[i]);
						}
						this._pointsModels[bundleName] = pointsModel;
					}.bind(this));
					promises.push(ajaxRequest);
				}.bind(this));
				$.when.apply($, promises).always(this._finishLoading.bind(this));
			},
			
			_finishLoading: function() {
				this._pointsView = new PointsView(this._osMap.getMap(), this._config, this._pointsModels, this._osMap.getControls(), this._osMap.getLayers());
				this._pointsView.finish(finish);
				this._osMap.getControls().addAllTo(this._osMap.getMap());
			}
		};
	}
);
