define(['leaflet', 'jquery', 'points_view', 'geojson_view', 'bundles/abstract_points_builder', 'bundles/abstract_geojson_builder', 'leaflet_matrixlayers'],
	function(leaflet, $, PointsView, GeojsonView, AbstractPointsBuilder, AbstractGeojsonBuilder, Leaflet_MatrixLayers) {
		var ModelViews = leaflet.Class.extend({
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
			
			_addLazyModels: function(lazyModels, matrixLayerControl, bundles, addCallback) {
				Object.keys(lazyModels).forEach(function(bundleName) {
					var model = lazyModels[bundleName];
					var callback = function() {
						model.fetchData().done(function() {
							addCallback(bundleName, model);
						});
					};
					var meta = model.getMeta();
					var description = meta.recordCount + " items (last updated " + meta.lastUpdated + ")";
					var bundleDetails = bundles[bundleName];
					matrixLayerControl.addLazyAspect(bundleName, bundleDetails, {
						description: description,
						callback: callback
					});

				}.bind(this));
			},
			
			loadModelViews: function(bundleModels, lazyModels, map, config, controls, layers, bundles, callback) {
				var pointsModels = this._filterModels(bundleModels, AbstractPointsBuilder);
				var geojsonModels = this._filterModels(bundleModels, AbstractGeojsonBuilder);
				var lazyPointsModels = this._filterModels(lazyModels, AbstractPointsBuilder);
				var lazyGeojsonModels = this._filterModels(lazyModels, AbstractGeojsonBuilder);
				var matrixLayerControl = null;
				if (config.dimensional_layering) {
					matrixLayerControl = new Leaflet_MatrixLayers(layers, null, {}, {
						multiAspects: true,
						embeddable: config.use_sidebar
					});
				}
				
				var pointsView = new PointsView(map, config, pointsModels, matrixLayerControl, controls, bundles);
				var geojsonView = new GeojsonView(map, config, geojsonModels, matrixLayerControl, bundles);
				var promises = [
					pointsView.finish(),
					geojsonView.finish()
				];
				
				if (config.dimensional_layering) {
					this._addLazyModels(lazyPointsModels, matrixLayerControl, bundles, function (bundleName, model) {
						pointsView.addClusteredModel(bundleName, model);
					});
					this._addLazyModels(lazyGeojsonModels, matrixLayerControl, bundles, function (bundleName, model) {
						geojsonView.addClusteredModel(bundleName, model);
					});
				}
				
				$.when.apply($, promises).always(function() {
					if (config.dimensional_layering) {
						//override the basic layers control
						controls.addControl(matrixLayerControl);
					}
					//add attribution texts
					Object.keys(bundleModels).forEach(function(aspect) {
						var model = bundleModels[aspect];
						var attribution = model.getAttribution();
						if (attribution != null && attribution.length > 0) {
							controls.addAttribution(attribution);
						}
					});
					callback();
				});
			}
		});
		return ModelViews;
	}
);
