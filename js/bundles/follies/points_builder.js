import AbstractPointsBuilder from '../abstract_points_builder';
		export default AbstractPointsBuilder.extend({
			parse: function(point) {
				//[Longitude,Latitude,Name,Url,Type,ImageLinks]
				var lng = point[0];
				var lat = point[1];
				var name = point[2];
				var url = point[3];
				var type = point[4];
				var imageLinks = point[5];
				
				var typeDisplay = this._bundleConfig.dimensionValueLabels[this._bundleConfig.dimensionNames[0]][type];
				if (typeDisplay == null) {
					typeDisplay = type;
				}

				var extraInfos = [
					['Type', typeDisplay],
					['Images', this.buildImageLinks(imageLinks)]
                ];
				
				this.addMarker(name, lat, lng, url, name, extraInfos, null, [type]);
			}
		});
	
