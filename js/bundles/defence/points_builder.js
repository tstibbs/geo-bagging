define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point) {
				//[Longitude,Latitude,Id,Categories,location,condition,description,imageLinks]
				var lng = point[0];
				var lat = point[1];
				var id = point[2];
				var categories = point[3];
				var url = point[4];
				var location = point[5];
				var condition = point[6];
				var description = point[7];
				var imageLinks = point[8];
                
                var style = categories.slice(-1)[0]
				var extraInfos = {
					'Style': style,
					'Position': location,
					'Notes': description,
                    'Images': this.buildImageLinks(imageLinks),
                    'Categories': categories.slice(0, -1)
				};
				this.addMarker(id, lat, lng, url, id, extraInfos, null, [condition]);
			},
		});
	}
);
