define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			//[Longitude,Latitude,Name,type,condition]
			parse: function(point) {
				var lng = point[0];
				var lat = point[1];
				var name = point[2];
				var type = point[3];
				var condition = point[4];

				var extraInfos = {
					'Type': type,
					'Condition': condition
				};
				this.addMarker(name, lat, lng, null, name, extraInfos, null, [type, condition]);
			},
		});
	}
);
