define(["underscore", "leaflet", "popup_view"],
	function(_, leaflet, popupView) {
	
		return {
			translateMarker: function(markerConfig, bundleConfig) {
				var latLng = markerConfig.latLng;
				var name = markerConfig.name;
				var extraTexts = markerConfig.extraTexts;
				var exportName = markerConfig.exportName;
				var icon = markerConfig.icon;
				var url = markerConfig.url;
				
				if (!popupView.notEmpty(name)) {
					name = url;
				}
				if (popupView.notEmpty(exportName)) {
					exportName = name;
				}
				
				var popupText = popupView.buildPopup(name, url, latLng, extraTexts);

				var markerOptions = {};
				if (bundleConfig.icons != null && bundleConfig.icons[icon] != null) {
					markerOptions.icon = bundleConfig.icons[icon];
				} else if (bundleConfig.defaultIcon != null) {
					markerOptions.icon = bundleConfig.defaultIcon;
				}
				var marker = leaflet.marker(latLng, markerOptions);
				marker.bindPopup(popupText);
				if (exportName != null) {
					exportName = _.escape(markerConfig.exportName);
					//selection control looks for .name in its default actions
					marker.name = exportName.replace(/"/g, "'");
				}
				return marker;
			}
		};
	}
);
