define(['../abstract_geojson_builder'],
	function(AbstractGeojsonBuilder) {
		return AbstractGeojsonBuilder.extend({
			parse: function(feature) {
				var name = feature.properties.npark16nm;
				var geojson = {
					"type": "FeatureCollection",
					"features": [feature]
				};
				return {
					name: name,
					geojson: geojson
				}
			}
		});
	}
);
