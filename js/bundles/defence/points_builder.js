define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point) {
                //[Longitude,Latitude,Id,Type,Purpose,Category,Style,Link,location,Condition,description,imageLinks]
				var lng = point[0];
				var lat = point[1];
                var id = point[2];
                var type = point[3];
                var purpose = point[4];
                var category = point[5];
                var style = point[6]
				var url = point[7];
				var location = point[8];
				var condition = point[9];
				var description = point[10];
                var imageLinks = point[11];

				var extraInfos = {
                    'Style': style,
                    'Purpose': purpose,
					'Position': location,
					'Notes': description,
                    'Images': this.buildImageLinks(imageLinks)
                };
                if (!style.includes(type)) { //if type is included in style, don't display
                    extraInfos['Type'] = type
                }
                if (category != null) {
                    extraInfos['Category'] = category
                }
				this.addMarker(id, lat, lng, url, id, extraInfos, null, [purpose, type, condition]);
			},
		});
	}
);
