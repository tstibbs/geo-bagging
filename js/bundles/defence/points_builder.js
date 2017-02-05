define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point, pointsModel) {
				//[Longitude,Latitude,Id,Name,location,condition,description]
				var lng = point[0];
				var lat = point[1];
				var id = point[2];
				var name = point[3];
				var location = point[4];
				var condition = point[5];
				var description = point[6];
				
				var url = "";
				
				var extraInfos = {
					'Style': name,
					'Position': location,
					'Notes': description
				};
				this.addMarker(lat, lng, url, id, extraInfos, 'icon', [condition]);
			},
		});
	}
);
