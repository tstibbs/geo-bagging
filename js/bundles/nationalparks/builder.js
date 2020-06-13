import AbstractGeojsonBuilder from '../abstract_geojson_builder';
		export default AbstractGeojsonBuilder.extend({
			parse: function(feature) {
				var name = feature.properties.name;
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
	
