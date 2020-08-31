import AbstractGeojsonBuilder from '../abstract_geojson_builder'

var Builder = AbstractGeojsonBuilder.extend({
	parse: function (feature) {
		var name = feature.properties.name
		var geojson = {
			type: 'FeatureCollection',
			features: [feature]
		}
		return {
			name: name,
			geojson: geojson
		}
	}
})

export default Builder
