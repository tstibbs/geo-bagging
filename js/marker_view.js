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
				markerOptions.layerId = markerConfig.layerId;
				var marker = leaflet.marker(latLng, markerOptions);
				marker.bindPopup(popupText);
				
				exportName = _.escape(markerConfig.exportName);
				var cmt = null;
				var desc = null;
				if (extraTexts != null) {
					cmt = _.escape(popupView.buildShortDescription(extraTexts));//build the extra texts html but escape it to encode into the exported xml
					desc = _.escape(popupView.buildDescription(extraTexts));//build the extra texts html but escape it to encode into the exported xml
				}
				//selection control looks for .exportData in its default actions
				marker.exportData = {
					name: exportName,
					link: url,
					cmt: cmt,
					desc: desc
				};
				return marker;
			}
		};
	}
);
