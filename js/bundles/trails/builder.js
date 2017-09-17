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
				var openedDate = new Date(feature.properties['Opened']).toLocaleDateString();
				var extraInfos = {
					'Length (miles)': feature.properties['Length_Mil'],
					'Opened': openedDate
				};
				return {
					name: name,
					url: url,
					geojson: geojson,
					extraInfos: extraInfos
				}
			}
		});
	}
);
