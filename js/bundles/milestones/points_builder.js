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
				var location = point[5];
				var position = point[6];
				var design = point[7];
				var url = point[8];
				var additionalPhoto1 = point[9];
				var additionalPhoto2 = point[10];
				
				function nullIfEmpty(value) {
					if (value == null || value.trim().lenght === 0 || value.trim() == ',') {
						return null;
					} else {
						return value;
					}
				}
				
				var extraInfos = [
					['Notes', nullIfEmpty(category)],
					['Design', nullIfEmpty(design)],
					['Location', nullIfEmpty(location)],
					['Position', nullIfEmpty(position)]
                ];
				this.addMarker(id, lat, lng, url, id, extraInfos, null, [type]);
			},
		});
	}
);
