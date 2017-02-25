define(["underscore", "jquery", "leaflet", "leaflet_cluster", "leaflet_subgroup", "leaflet_matrixlayers", "marker_view"],
	function(_, $, leaflet, leaflet_cluster, leaflet_subgroup, Leaflet_MatrixLayers, markerView) {
	
		var PointsView = leaflet.Class.extend({
			initialize: function (map, config, modelsByAspect, controls, layers) {
				this._map = map;
				this._config = config;
				this._modelsByAspect = modelsByAspect;
				this._controls = controls;
				this._layers = layers;
			},

			_translateMarkerGroup: function(group, bundleConfig) {
				if (group != null) {
					if (group.constructor === Array) {
						group.forEach(function(markerConfig, i, group) {
							group[i] = markerView.translateMarker(markerConfig, bundleConfig);
						}, this);
					} else { //is hash
						for (dimension in group) {
							group[dimension] = this._translateMarkerGroup(group[dimension], bundleConfig);
						}
					}
				}
				return group;
			},
			
			finish: function (finished) {
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
								finished();
							}
						}
					});
				} else {
					parentGroup = leaflet.layerGroup();
					finished();
				}
				
				parentGroup.addTo(this._map);
				if (!this._config.dimensional_layering) {
					var markerLists = Object.keys(this._modelsByAspect).map(function(aspect) {
						var model = this._modelsByAspect[aspect]
						return this._translateMarkerGroup(model.getMarkerList(), model.getBundleConfig());
					}.bind(this)).filter(function(value) {
						return value != null;
					});
					var markerList = [].concat.apply([], markerLists);
					if (this._config.cluster) {
						parentGroup.addLayers(markerList);
					} else {
						for (var i = 0; i < markerList.length; i++) {
							parentGroup.addLayer(markerList[i]);
						}
					}
				} else {
					var control = new Leaflet_MatrixLayers(this._layers, null, {}, {
						multiAspects: true
					});
					for (var aspect in this._modelsByAspect) {
						var model = this._modelsByAspect[aspect];
						if (model.getMarkerList() != null) {
							var markerList = this._translateMarkerGroup(model.getMarkerList(), model.getBundleConfig());
							var matrixOverlays = {};
							var iter = function(markers, path) {
								if (markers.constructor === Array) {
									var subGroup = leaflet.featureGroup.subGroup(parentGroup, markers);
									//don't add to the map yet - let the layer control do that if it thinks it needs to - otherwise we could add all layers then immediately try to remove them all, which can cause UI weirdness
									matrixOverlays[path] = subGroup;
								} else {
									Object.keys(markers).forEach(function (dimValue) {
										var newPath = path.length == 0 ? dimValue : path + '/' + dimValue;
										var sublist = markers[dimValue];
										iter(sublist, newPath);
									});
								}
							}
							iter(markerList, '');
							var aspectOptions = this._config.bundles[aspect];//will have other options, but collisions are unlikely
							control.addAspect(aspect, matrixOverlays, aspectOptions);
						}
					}
					//override the basic layers control
					this._controls.addControl(control);
				}
				//add attribution texts
				Object.keys(this._modelsByAspect).forEach(function(aspect) {
					var model = this._modelsByAspect[aspect];
					var attribution = model.getAttribution();
					if (attribution != null && attribution.length > 0) {
						this._controls.addAttribution(attribution);
					}
				}.bind(this));
			}
		});

		return PointsView;
	}
);
