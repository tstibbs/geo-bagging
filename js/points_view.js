define(["underscore", "leaflet", "leaflet_cluster", "leaflet_subgroup", "leaflet_matrixlayers"],
	function(_, leaflet, leaflet_cluster, leaflet_subgroup, Leaflet_MatrixLayers) {
	
		var PointsView = leaflet.Class.extend({
			initialize: function (map, config, modelsByAspect, controls, layers) {
				this._map = map;
				this._config = config;
				this._modelsByAspect = modelsByAspect;
				this._controls = controls;
				this._layers = layers;
			},
			
			_notEmpty: function(input) {
				return input !== undefined && input !== null && input.length > 0;
			},
			
			_buildPopup: function(name, url, latLng, extraTexts) {
				var popupText = "";
				if (this._notEmpty(url)) {
					popupText = '<a href="' + url + '" class="popup-title">' + name + '</a>';
				} else if (this._notEmpty(name)) {
					popupText = '<span class="popup-title">' + name + '</span>';
				}
				if (extraTexts != null) {
					Object.keys(extraTexts).forEach(function(key) {
						if (popupText.length > 0) {
							popupText += '<br />';
						}
						popupText += '<span class="popup-entry-key">' + key + ': </span>';
						var value = extraTexts[key];
						if (Array.isArray(value)) {
							popupText += '<ul class="popup-entry-list">'
							for (var i = 0; i < value.length; i++) {
								popupText += '<li>' + value[i] + '</li>'
							}
							popupText += '</ul>'
						} else {
							popupText += '<span>' + value + '</span>';
						}
					}.bind(this));
				}
				
				var lat = latLng[0];
				var lng = latLng[1];
				var googleUrl = 'https://www.google.com/maps/place/' + lat + '+' + lng + '/@' + lat + ',' + lng + ',15z';
				var bingUrl = 'https://www.bing.com/maps/?mkt=en-gb&v=2&cp=' + lat + '~' + lng + '&lvl=14&sp=Point.' + lat + '_' + lng + '_' + name;
				var geohackUrl = 'https://tools.wmflabs.org/geohack/geohack.php?pagename=' + name + '&params=' + lat + '_N_' + lng + '_E_region%3AGB_';
				
				popupText += '<div class="expandable expandable-links">';
					popupText += '<input type="checkbox" value="selected" id="links-checkbox" class="expandable-checkbox">';
					popupText += '<label for="links-checkbox" class="expandable-checkbox-label"><i class="fa fa-external-link" aria-hidden="true"></i></label>';
					popupText += '<div class="expandable-content links">';
						popupText += '<a href="' + googleUrl + '">View on google maps</a>';
						popupText += '<br /><a href="' + bingUrl + '">View on bing maps</a>';
						popupText += '<br /><a href="' + geohackUrl + '">View on geohack</a>';
					popupText += '</div>';
				popupText += '</div>';

				return popupText;
			},
			
			_translateMarker: function(markerConfig, bundleConfig) {
				//get everything from the model - anything that gets put into the dom needs to be escaped to prevent XSS
				var latLng = markerConfig.latLng;
				var name = _.escape(markerConfig.name);
				var extraTexts = markerConfig.extraTexts;
				if (extraTexts != null) {
					var newExtraTexts = {};
					Object.keys(extraTexts).forEach(function(key) {
						var escapedKey = _.escape(key);
						var value = extraTexts[key];
						if (Array.isArray(value)) {
							newExtraTexts[escapedKey] = value.map(_.escape);
						} else {
							newExtraTexts[escapedKey] = _.escape(value);
						}
					});
					extraTexts = newExtraTexts;
				}
				var exportName = _.escape(markerConfig.exportName);
				var icon = markerConfig.icon;
				var url = _.escape(markerConfig.url);
				
				if (!this._notEmpty(name)) {
					name = url;
				}
				if (this._notEmpty(exportName)) {
					exportName = name;
				}
				
				var popupText = this._buildPopup(name, url, latLng, extraTexts);

				var markerOptions = {};
				if (bundleConfig.icons != null && bundleConfig.icons[icon] != null) {
					markerOptions.icon = bundleConfig.icons[icon];
				} else if (bundleConfig.defaultIcon != null) {
					markerOptions.icon = bundleConfig.defaultIcon;
				}
				var marker = leaflet.marker(latLng, markerOptions);
				marker.bindPopup(popupText);
				if (exportName != null) {
					//selection control looks for .name in its default actions
					marker.name = exportName.replace(/"/g, "'");
				}
				return marker;
			},

			_translateMarkerGroup: function(group, bundleConfig) {
				if (group != null) {
					if (group.constructor === Array) {
						group.forEach(function(markerConfig, i, group) {
							group[i] = this._translateMarker(markerConfig, bundleConfig);
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
					parentGroup = leaflet_cluster({
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
			}
		});

		return PointsView;
	}
);
