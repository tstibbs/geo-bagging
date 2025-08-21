import Builder from './builder.js'

var name = 'Counties'

export default {
	aspectLabel: name,
	dimensionNames: [name],
	dataToLoad: 'data.geojson',
	parser: Builder,
	style: {
		initialOutlineWidth: 1,
		fillOpacity: 0
	}
}
