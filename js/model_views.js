define([
	'leaflet',
	'jquery',
	'points_view',
	'geojson_view',
	'bundles/abstract_points_builder',
	'bundles/abstract_geojson_builder',
	'leaflet_matrixlayers',
	'./utils/url_handler'
],
	function(
		leaflet,
		$,
		PointsView,
		GeojsonView,
		AbstractPointsBuilder,
		AbstractGeojsonBuilder,
		Leaflet_MatrixLayers,
		UrlHandler
	) {
		var ModelViews = leaflet.Class.extend({
			initialize: function (bundles, manager) {
				this._bundles = bundles;
				this._manager = manager;
				this._controls = manager.getControls();
				this._matrixLayerControl = null;
				this._urlHandler = new UrlHandler();
			},			
			
			_filterModels: function(bundleModels, className) {
				var matchingModels = {};
				Object.keys(bundleModels).filter(function(bundleName) {
					var model = bundleModels[bundleName];
					return model instanceof className;
				}).forEach(function(bundleName) {
					matchingModels[bundleName] = bundleModels[bundleName];
				});
				return matchingModels;
			},
			
			_addLazyModels: function(lazyModels, addCallback) {
				Object.keys(lazyModels).forEach(function(bundleName) {
					var model = lazyModels[bundleName];
					var callback = function() {
						model.fetchData().done(function() {
							addCallback(bundleName, model);
							this._addAttribution(bundleName, model);
							this._urlHandler.sourceLoaded(bundleName);
						}.bind(this));
					}.bind(this);
					var meta = model.getMeta();
					var description = meta.recordCount + " items (last updated " + meta.lastUpdated + ")";
					var bundleDetails = this._bundles[bundleName];
					this._matrixLayerControl.addLazyAspect(bundleName, bundleDetails, {
						description: description,
						callback: callback
					});

				}.bind(this));
			},
			
			_addAttribution: function(bundleName, model) {
				var attribution = model.getAttribution();
				if (attribution != null && attribution.length > 0) {
					var dataSourceLabel = model.getBundleConfig().aspectLabel;
					this._controls.addAttribution(dataSourceLabel, attribution);
				}
			},
			
			loadModelViews: function(bundleModels, lazyModels, config, callback) {
				var pointsModels = this._filterModels(bundleModels, AbstractPointsBuilder);
				var geojsonModels = this._filterModels(bundleModels, AbstractGeojsonBuilder);
				var lazyPointsModels = this._filterModels(lazyModels, AbstractPointsBuilder);
				var lazyGeojsonModels = this._filterModels(lazyModels, AbstractGeojsonBuilder);
				if (config.dimensional_layering) {
					
					this._matrixLayerControl = new Leaflet_MatrixLayers(this._manager.getLayers(), null, {}, {
						multiAspects: true,
						embeddable: config.use_sidebar
					});
				}
				
				var pointsView = new PointsView(this._manager.getMap(), config, pointsModels, this._matrixLayerControl, this._controls, this._bundles, this._manager);
				var geojsonView = new GeojsonView(this._manager.getMap(), config, geojsonModels, this._matrixLayerControl, this._bundles);
				var promises = [
					pointsView.finish(),
					geojsonView.finish()
				];
				
				if (config.dimensional_layering) {
					this._addLazyModels(lazyPointsModels, function (bundleName, model) {
						pointsView.addClusteredModel(bundleName, model);
					});
					this._addLazyModels(lazyGeojsonModels, function (bundleName, model) {
						geojsonView.addClusteredModel(bundleName, model);
					});
				}
				
				$.when.apply($, promises).always(function() {
					if (config.dimensional_layering) {
						//override the basic layers control
						this._controls.addControl(this._matrixLayerControl);
					}
					//add attribution texts
					Object.keys(bundleModels).forEach(function(aspect) {
						var model = bundleModels[aspect];
						this._addAttribution(aspect, model);
					}.bind(this));
					callback();
				}.bind(this));
			}
		});
		return ModelViews;
	}
);
