define(['conversion', '../abstract_points_builder'],
	function(conversion, AbstractPointsBuilder) {
		return AbstractPointsBuilder.extend({
			parse: function(point, pointsModel) {
				//[Type,National_ID,Grid_Reference,Category],
				var type = point[0];
				var id = point[1];
				var gridref = point[2];
				var category = point[3];
				
				var lngLat;
				try {
					lngLat = conversion.gridRefToLngLat(gridref);	
				} catch (err) {
					if (console) {console.log(err);}
					return;
				}
				
				var url = "";
				
				var extraInfos = {
					'Category': category
				};
				this.addMarker(lngLat[1], lngLat[0], url, id, extraInfos, 'icon', [type]);
			},
		});
	}
);
