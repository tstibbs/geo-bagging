define(['../abstract_geojson_builder'],
	function(AbstractGeojsonBuilder) {
		return AbstractGeojsonBuilder.extend({
			parse: function(feature) {
				var name = feature.properties.Name;
				var url = this.getBundleConfig().urls[name];
				var geojson = {
					"type": "FeatureCollection",
					"features": [feature]
				};
				return {
					name: name,
					url: url,
					geojson: geojson
				}
			}
		});
	}
);
