define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point, pointsModel) {
				//[Type,National_ID,Long,Lat,Category],
				var type = point[0];
				var id = point[1];
				var lng = point[2];
				var lat = point[3];
				var category = point[4];
				
				var url = "";
				
				var extraInfos = {
					'Notes': category
				};
				this.addMarker(lat, lng, url, id, extraInfos, 'icon', [type]);
			},
		});
	}
);
