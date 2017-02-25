define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point) {
				//[Longitude,Latitude,Name,Type,Url,OtherImageLinks]
				var lng = point[0];
				var lat = point[1];
				var name = point[2];
				var type = point[3];
				var url = point[4];
				var otherImage = point[5];
				
				var typeDisplay = this._bundleConfig.dimensionValueLabels[this._bundleConfig.dimensionNames[0]][type];
				if (typeDisplay == null) {
					typeDisplay = type;
				}

				var extraInfos = {
					'Type': typeDisplay,
					'Images': this.buildImageLinks([otherImage])
				};
				this.addMarker(null, lat, lng, url, name, extraInfos, null, [type]);
			}
		});
	}
);
