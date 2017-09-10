define(["underscore", "jquery", "leaflet", "leaflet_cluster", "leaflet_subgroup", "leaflet_matrixlayers"],
	function(_, $, leaflet, leaflet_cluster, leaflet_subgroup, Leaflet_MatrixLayers) {
	
		return {
			_notEmpty: function(input) {
				return input !== undefined && input !== null && input.length > 0;
			},
			
			_buildValue: function(value) {
				if (Array.isArray(value) && value.length == 2) {
					return '<a href="' + value[1] + '">' + value[0] + '</a>';
				} else {
					return value;
				}
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
						var value = extraTexts[key];
						if (value != null && value != "") {
							if (popupText.length > 0) {
								popupText += '<br />';
							}
							popupText += '<span class="popup-entry-key">' + key + ': </span>';
							if (Array.isArray(value)) {
								if (value.length > 1) {
									popupText += '<ul class="popup-entry-list">';
									for (var i = 0; i < value.length; i++) {
										popupText += '<li>' + this._buildValue(value[i]) + '</li>';
									}
									popupText += '</ul>';
								} else {
									popupText += '<span>' + this._buildValue(value[0]) + '</span>';
								}
							} else {
								popupText += '<span>' + this._buildValue(value) + '</span>';
							}
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
			
			_escapeValue: function(value) {
				if (Array.isArray(value)) {
					//return value.map(function(elem){return this._escapeValue(elem);}.bind(this));
					return value.map(this._escapeValue.bind(this));
				} else {
					return _.escape(value);
				}
			},
			
			translateMarker: function(markerConfig, bundleConfig) {
				//get everything from the model - anything that gets put into the dom needs to be escaped to prevent XSS
				var latLng = markerConfig.latLng;
				var name = _.escape(markerConfig.name);
				var extraTexts = markerConfig.extraTexts;
				if (extraTexts != null) {
					var newExtraTexts = {};
					Object.keys(extraTexts).forEach(function(key) {
						var escapedKey = _.escape(key);
						var value = extraTexts[key];
						newExtraTexts[escapedKey] = this._escapeValue(value);
					}.bind(this));
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
			}
		};
	}
);
