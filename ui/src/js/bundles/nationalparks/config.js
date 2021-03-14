import Builder from './builder.js'

var name = 'National Parks'

export default {
	aspectLabel: name,
	dimensionNames: [name],
	dataToLoad: 'data.geojson',
	parser: Builder,
	attribution:
		'Office for National Statistics (<a href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/">OGL</a>)'
}
