define(["leaflet", "os_map", "points_view", "geojson_view", "config", "params", "conversion", "jquery", 'bundles/trigs/config_embedding', 'map_view', 'bundles/abstract_points_builder', 'model_views'],
	function(leaflet, OsMap, PointsView, GeojsonView, Config, params, conversion, $, trigsPointsBundle, mapView, AbstractPointsBuilder, ModelViews) {
			
		return {			
			getBundleIds: function(bundles) {
				var allBundles = [];
				if (bundles != null) {
					allBundles.push.apply(allBundles, bundles);
				}
				var dataSourcesString = params('datasources');
				if (dataSourcesString != null && dataSourcesString.length > 0) {
					allBundles.push.apply(allBundles, dataSourcesString.split(','));
				}
				//legacy options
				if (params('hills') == 'true') {
					allBundles.push('hills');
				}
				if (params('trigs') == 'true') {
					allBundles.push('trigs');
				}
				//end legacy options
				return allBundles;
			},
			
			_bundleIdsToDataSources: function(options, bundles) {
				var allBundles;
				if (options.skipLandingPage) {
					allBundles = this.getBundleIds(bundles);
				} else {
					allBundles = bundles;
				}
				if (allBundles != null) {
					allBundles = allBundles.map(function(bundle) {
						if (bundle.indexOf('/') == -1) {
							return bundle + '/config';
						} else {
							return bundle;
						}
					});
				} else {
					allBundles = [];
				}
				return allBundles;
			},
		
			loadMap: function(options, bundleIds) {
				var allBundleIds = this._bundleIdsToDataSources(options, bundleIds);
				if (this.hasUrlData()) {
					alert('Loading data from URL is no longer an option.');
					throw new Error('Loading data from URL is no longer an option.');
				} else if (options.pointsToLoad != null) {
					var generalPoints = options.pointsToLoad.generalPoints;
					options.cluster = (generalPoints.length > 300);
					options.dimensional_layering = false;
					allBundleIds = ['trigs/config_embedding'];
				}
				if (allBundleIds.length == 0) {
					throw new Error("No config bundle specified");
				}
				options = $.extend({ //set some defaults that can be overriden by the page or by loadMiniMap
					cluster: true,
					dimensional_layering: true
				}, options);
				var bundleModuleIds = allBundleIds.map(function(bundleId){
					return 'bundles/' + bundleId;
				});
				
				var deferredObject = $.Deferred();
				require(bundleModuleIds, function(/*bundles...*/) {
					var configBundles = {};
					for (var i = 0; i < arguments.length; i++) {
						configBundles[allBundleIds[i]] = arguments[i];
					}
					var map = this.buildMapWithBundleDatas(options, configBundles);
					deferredObject.resolve(map);
				}.bind(this));
				return deferredObject.promise();
			},
			
			loadMiniMap: function(options, bundles) {
				//set some defaults that can be overriden by the page
				options = $.extend({
					cluster: false,
					dimensional_layering: false,
					initial_zoom: 10,
					start_position: [54.454463, -3.213515],
					show_search_control: false,
					show_locate_control: false,
					show_hider_control: true,
					hider_control_start_visible: false,
					map_style: 'mini',
					use_sidebar: false
				}, options);
				if (bundles == null) { //default if we haven't passed one in
					bundles = ['trigs/config_mini'];
				}
				this.loadMap(options, bundles);
			},
		
			_buildMap: function(options, bundles) {
				this._config = new Config(options, bundles);
				mapView(this._config);
				this._osMap = new OsMap(this._config);
				this._bundleModels = {};
				return this._osMap;
			},
			
			hasUrlData: function() {
				return params('trigs') != null;
			},
			
			buildMapWithBundleDatas: function(options, bundles) {
				var map = this._buildMap(options, bundles);
				//https://tstibbs.github.io/geo-bagging/js/bundles/trigs/data_all.json
				var bundleDataPrefix = (this._config.remoteData ? 'https://tstibbs.github.io/geo-bagging' : window.os_map_base);//some mobile browsers don't support local ajax, so this provides a workaround for dev on mobile devices.
				var promises = Object.keys(bundles).map(function(bundleName) {
					var bundle = bundles[bundleName];
					var bundleModel = new bundle.parser(this._config, bundle, bundleName);
					this._bundleModels[bundleName] = bundleModel;
					return bundleModel.fetchData(bundleDataPrefix);
				}.bind(this));
				$.when.apply($, promises).always(this._finishLoading.bind(this));
				return map;
			},
			
			_finishLoading: function() {
				var modelViews = new ModelViews();
				modelViews.loadModelViews(this._bundleModels, this._osMap.getMap(), this._config, this._osMap.getControls(), this._osMap.getLayers(), this._finish);
			},
			
			_finish: function() {
				$('div#loading-message-pane').hide();
			}
		};
	}
);
