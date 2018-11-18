define(['leaflet', 'jquery', 'points_view', 'geojson_view', 'bundles/abstract_points_builder', 'bundles/abstract_geojson_builder', 'leaflet_matrixlayers'],
	function(leaflet, $, PointsView, GeojsonView, AbstractPointsBuilder, AbstractGeojsonBuilder, Leaflet_MatrixLayers) {
		var ModelViews = leaflet.Class.extend({
			initialize: function (bundles, controls) {
				this._bundles = bundles;
				this._controls = controls;
				this._matrixLayerControl = null;
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
					this._controls.addAttribution(bundleName, attribution);
				}
			},
			
			loadModelViews: function(bundleModels, lazyModels, map, config, layers, callback) {
				var pointsModels = this._filterModels(bundleModels, AbstractPointsBuilder);
				var geojsonModels = this._filterModels(bundleModels, AbstractGeojsonBuilder);
				var lazyPointsModels = this._filterModels(lazyModels, AbstractPointsBuilder);
				var lazyGeojsonModels = this._filterModels(lazyModels, AbstractGeojsonBuilder);
				if (config.dimensional_layering) {
					this._matrixLayerControl = new Leaflet_MatrixLayers(layers, null, {}, {
						multiAspects: true,
						embeddable: config.use_sidebar
					});
				}
				
				var pointsView = new PointsView(map, config, pointsModels, this._matrixLayerControl, this._controls, this._bundles);
				var geojsonView = new GeojsonView(map, config, geojsonModels, this._matrixLayerControl, this._bundles);
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
