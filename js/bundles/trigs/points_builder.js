define(['conversion', '../abstract_points_builder'],
	function(conversion, AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point) {
				//['osgb_gridref','waypoint','name','physical_type','condition'],
				var gridref = point[0];
				var waypoint = point[1];
				var name = point[2];
				var physicalType = point[3];
				var condition = point[4];
				var waypointRegex = /TP0*(\d+)/;
				var url = null;
				if (waypointRegex.test(waypoint)) {
					var match = waypointRegex.exec(waypoint);
					var trigId = match[1];
					url = 'http://trigpointing.uk/trig/' + trigId;
				}
				var lngLat;
				try {
					lngLat = conversion.gridRefToLngLat(gridref);	
				} catch (err) {
					if (console) {console.log(err);}
					return;
				}
				var extraTexts = {
					'Condition': condition,
					'Physical Type': physicalType
				};
				this.addMarker(lngLat[1], lngLat[0], url, name, extraTexts, physicalType, [physicalType, condition]);
			},
			
			//called from main
			add: function (lngLat, url, name, extraTexts, physicalType, condition) {
				this.addMarker(lngLat[1], lngLat[0], url, name, extraTexts, physicalType, [physicalType, condition]);
			}
		});
	}
);
