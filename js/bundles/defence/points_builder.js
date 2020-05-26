define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point) {
                //[Longitude,Latitude,Id,Type,Purpose,Categories,Link,location,Condition,description,imageLinks]
				var lng = point[0];
				var lat = point[1];
                var id = point[2];
                var type = point[3];
                var purpose = point[4];
				var categories = point[5];
				var url = point[6];
				var location = point[7];
				var condition = point[8];
				var description = point[9];
				var imageLinks = point[10];
                
                var style = categories.slice(-1)[0]
				var extraInfos = {
                    'Style': style,
                    'Type': type,
                    'Purpose': purpose,
					'Position': location,
					'Notes': description,
                    'Images': this.buildImageLinks(imageLinks),
                    'Categories': categories.slice(0, -1)
				};
				this.addMarker(id, lat, lng, url, id, extraInfos, null, [purpose, type, condition]);
			},
		});
	}
);
