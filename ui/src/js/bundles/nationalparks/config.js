import Builder from './builder.js'

var name = 'National Parks'

export default {
	aspectLabel: name,
	dimensionNames: [name],
	dataToLoad: 'data.geojson',
	parser: Builder,
	style: {
		initialOutlineWidth: 1
	}
}
