define(["underscore", "jquery", "leaflet", "leaflet_cluster", "leaflet_subgroup", "leaflet_matrixlayers", "marker_view"],
	function(_, $, leaflet, leaflet_cluster, leaflet_subgroup, Leaflet_MatrixLayers, markerView) {
	
		var PointsView = leaflet.Class.extend({
			initialize: function (map, config, modelsByAspect, matrixLayerControl, controls) {
				this._map = map;
				this._config = config;
				this._modelsByAspect = modelsByAspect;
				this._matrixLayerControl = matrixLayerControl;
				this._controls = controls;
			},

			_translateMarkerGroup: function(group, bundleConfig) {
				if (group != null) {
					if (group.constructor === Array) {
						group.forEach(function(markerConfig, i, group) {
							group[i] = markerView.translateMarker(markerConfig, bundleConfig);
						}, this);
					} else { //is hash
						for (var dimension in group) {
							group[dimension] = this._translateMarkerGroup(group[dimension], bundleConfig);
						}
					}
				}
				return group;
			},
			
			finish: function (finished) {
				var deferredObject = $.Deferred();
				
				var parentGroup = null;
				if (this._config.cluster) {
					var mapElem = $('div#map');
					var radius = (Math.max(mapElem[0].offsetHeight, mapElem[0].offsetWidth) / 10);
					parentGroup = leaflet_cluster({
						disableClusteringAtZoom: 15,
						maxClusterRadius: radius,
						chunkedLoading: true,
						chunkProgress: function (processed, total, elapsed, layersArray) {
							if (processed === total) {
								deferredObject.resolve();
							}
						}
					});
				} else {
					parentGroup = leaflet.layerGroup();
					deferredObject.resolve();
				}
				
				parentGroup.addTo(this._map);
				if (!this._config.dimensional_layering) {
					var markerLists = Object.keys(this._modelsByAspect).map(function(aspect) {
						var model = this._modelsByAspect[aspect];
						return this._translateMarkerGroup(model.getMarkerList(), model.getBundleConfig());
					}.bind(this)).filter(function(value) {
						return value != null;
					});
					var allMarkers = [].concat.apply([], markerLists);
					if (this._config.cluster) {
						parentGroup.addLayers(allMarkers);
					} else {
						for (var i = 0; i < allMarkers.length; i++) {
							parentGroup.addLayer(allMarkers[i]);
						}
					}
				} else {
					function iter(markers, path, overlays) {
						if (markers.constructor === Array) {
							var subGroup = leaflet.featureGroup.subGroup(parentGroup, markers);
							//don't add to the map yet - let the layer control do that if it thinks it needs to - otherwise we could add all layers then immediately try to remove them all, which can cause UI weirdness
							overlays[path] = subGroup;
						} else {
							Object.keys(markers).forEach(function (dimValue) {
								var newPath = path.length === 0 ? dimValue : path + '/' + dimValue;
								var sublist = markers[dimValue];
								iter(sublist, newPath, overlays);
							});
						}
					}
					for (var aspect in this._modelsByAspect) {
						var model = this._modelsByAspect[aspect];
						if (model.getMarkerList() != null) {
							var markerList = this._translateMarkerGroup(model.getMarkerList(), model.getBundleConfig());
							var matrixOverlays = {};
							iter(markerList, '', matrixOverlays);
							var aspectOptions = this._config.bundles[aspect];//will have other options, but collisions are unlikely
							this._matrixLayerControl.addAspect(aspect, matrixOverlays, aspectOptions);
						}
					}
				}
				
				return deferredObject.promise();
			}
		});

		return PointsView;
	}
);
