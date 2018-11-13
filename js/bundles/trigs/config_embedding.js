define([
	'jquery',
	'conversion',
	'custom_default_icon',
	'./config_base',
	'./points_builder'
], 
	function(
		$,
		conversion,
		CustomDefaultIcon,
		trigpointingBase,
		TrigsPointsBuilder
	) {
		var redIconPath = window.os_map_base + 'img/hill.png';
		return $.extend(true, {}, trigpointingBase, {
			icons: {
				searchResult: new CustomDefaultIcon(redIconPath, {iconUrl: redIconPath})
			},
			parser: TrigsPointsBuilder.extend({
				initialize: function (config, bundleConfig, bundleName, urlPrefix) {
					TrigsPointsBuilder.prototype.initialize.call(this, config, bundleConfig, bundleName, urlPrefix);
					var generalPoints = config.pointsToLoad.generalPoints;
					for (var i = 0; i < generalPoints.length; i++) {
						var point = generalPoints[i];
						var lngLat = conversion.osgbToLngLat(point.eastings, point.northings);
						this.addWithoutDimensions(lngLat, point.url, point.name);
					}
					var significantPoint = config.pointsToLoad.significantPoint;
					if (significantPoint != null) {
						var lngLat = conversion.osgbToLngLat(significantPoint.eastings, significantPoint.northings);
						var iconName = 'searchResult';
						this.addWithoutDimensions(lngLat, significantPoint.url, significantPoint.name, iconName);
					}
				},
				
				fetchData: function() {
					//not relevant, ignore
					return $.Deferred().resolve().promise();
				},

				fetchMeta: function() {
					//not relevant, ignore
					return $.Deferred().resolve().promise();
				}
			})
		});
	}
);
