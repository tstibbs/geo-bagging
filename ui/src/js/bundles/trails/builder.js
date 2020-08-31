import AbstractGeojsonBuilder from '../abstract_geojson_builder'

var Builder = AbstractGeojsonBuilder.extend({
	parse: function (feature) {
		var name = feature.properties.name
		var url = this.getBundleConfig().urls[name]
		var geojson = {
			type: 'FeatureCollection',
			features: [feature]
		}
		var extraInfos = [
			['Length (miles)', feature.properties.length],
			['Notes', feature.properties.notes]
		]
		var openedDate = feature.properties['openedDate']
		if (openedDate != null) {
			var formattedDate = new Date(openedDate).toLocaleDateString()
			extraInfos.push(['Opened', formattedDate])
		}
		return {
			name: name,
			url: url,
			geojson: geojson,
			extraInfos: extraInfos
		}
	}
})

export default Builder
