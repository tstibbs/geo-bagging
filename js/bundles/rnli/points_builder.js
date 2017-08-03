define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point) {
				//[Longitude,Latitude,Name,Link]
				var lng = point[0];
				var lat = point[1];
				var name = point[2];
				var link = point[3];

				this.addMarker(name, lat, lng, link, name, null, null, []);
			},
		});
	}
);
