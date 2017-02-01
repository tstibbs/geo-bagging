define(['conversion', '../abstract_points_builder'],
	function(conversion, AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point) {
				//[Longitude,Latitude,Id,Name,physical_type,condition]
				var lng = point[0];
				var lat = point[1];
				var id = point[2];
				var name = point[3];
				var physicalType = point[4];
				var condition = point[5];
				var waypointRegex = /TP0*(\d+)/;
				var url = null;
				if (waypointRegex.test(id)) {
					var match = waypointRegex.exec(id);
					var trigId = match[1];
					url = 'http://trigpointing.uk/trig/' + trigId;
				}
				var extraTexts = {
					'Condition': condition,
					'Physical Type': physicalType
				};
				this.addMarker(lat, lng, url, name, extraTexts, physicalType, [physicalType, condition]);
			},
			
			//called from main
			add: function (lngLat, url, name, extraTexts, physicalType, condition) {
				this.addMarker(lngLat[1], lngLat[0], url, name, extraTexts, physicalType, [physicalType, condition]);
			}
		});
	}
);
