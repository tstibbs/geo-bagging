define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point) {
				//[Longitude,Latitude,Id,Name,Link,type,facilities]
				var lng = point[0];
				var lat = point[1];
				var id = point[2];
				var name = point[3];
				var link = point[4];
				var type = point[5];
				var facilities = point[6];

				this.addMarker(id, lat, lng, link, name, null, null, [type, facilities]);
			},
		});
	}
);
