define(['../abstract_points_builder'],
	function(AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point, pointsModel) {
				//["Number","Name","Classification","Metres","Longitude","Latitude"],
				var number = point[0];
				var name = point[1];
				var classification = point[2];
				var height = point[3];
				var lng = point[4];
				var lat = point[5];
				
				var lngLat = [lng, lat];
				var url = "";
				var physicalType = "*";
				var condition = "*";

				var classificationStrings = classification.split(';').map(function(classf) {
					var displayString = this._bundleConfig.dimensionValueLabels[this._bundleConfig.dimensionNames[0]][classf];
					if (displayString == null) {
						displayString = classf;
					}
					return displayString;
				}.bind(this));
				var extraInfos = {
					'Height': height,
					'Classifications': classificationStrings
				};
				this.addMarker(lngLat[1], lngLat[0], url, name, extraInfos, 'icon', [classification]);
			},
		});
	}
);
