define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point) {
				//[Longitude,Latitude,Id,Name,location,condition,description]
				var lng = point[0];
				var lat = point[1];
				var id = point[2];
				var name = point[3];
				var url = point[4];
				var location = point[5];
				var condition = point[6];
				var description = point[7];
				
				var extraInfos = {
					'Style': name,
					'Position': location,
					'Notes': description
				};
				this.addMarker(id, lat, lng, url, id, extraInfos, null, [condition]);
			},
		});
	}
);
