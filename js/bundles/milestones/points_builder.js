define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point) {
				//[Longitude,Latitude,Id,Type,Category]
				var lng = point[0];
				var lat = point[1];
				var id = point[2];
				var type = point[3];
				var category = point[4];
				
				var url = "";
				
				var extraInfos = {
					'Notes': category
				};
				this.addMarker(lat, lng, url, id, extraInfos, null, [type]);
			},
		});
	}
);
