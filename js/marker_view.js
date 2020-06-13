import $ from 'jquery';
import _ from 'underscore';
import leaflet from 'VendorWrappers/leaflet';
import popupView from './popup_view';
import constants from './constants';
	
		export default {
			translateMarker: function(markerConfig, bundleConfig, aspectName, manager) {
				var latLng = markerConfig.latLng;
				var name = markerConfig.name;
				var extraTexts = markerConfig.extraTexts;
				var exportName = markerConfig.exportName;
				var icon = markerConfig.icon;
				var url = markerConfig.url;
				var visited = markerConfig.visited;
				
				if (!popupView.notEmpty(name)) {
					name = url;
				}
				if (popupView.notEmpty(exportName)) {
					exportName = name;
				}
				
				var popupText = popupView.buildPopup(manager, name, url, latLng, extraTexts, visited);

				var markerOptions = {};
				if (bundleConfig.icons != null && bundleConfig.icons[icon] != null) {
					markerOptions.icon = bundleConfig.icons[icon];
				} else if (bundleConfig.defaultIcon != null) {
					markerOptions.icon = bundleConfig.defaultIcon;
				}
				markerOptions.layerId = markerConfig.layerId;
				var marker = leaflet.marker(latLng, markerOptions);
				var popupElem = $('<div>' + popupText + '</div>');
				if (manager.shouldManageVisits()) {
					$('input', popupElem).change(function() {
						var endpoint = '';
						if (this.checked) {
							endpoint = 'recordVisit';
						} else {
							endpoint = 'removeVisit';
						}
						$.post({
							url: constants.backendBaseUrl + endpoint,
							data: JSON.stringify({
								source: aspectName,
								name: markerConfig.id
							}),
							contentType: 'application/json',
							xhrFields: {
								withCredentials: true
							}
						}).catch(function(jqXhr, textStatus, errorThrown) {
							if (jqXhr.status == 401) {
								console.log("Authentication required");
							} else {
								console.log("Request failed: " + jqXhr.status + ", " + textStatus + ", " + errorThrown);
							}
						});
					});
				}
				marker.bindPopup(popupElem[0]);
				
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
	
