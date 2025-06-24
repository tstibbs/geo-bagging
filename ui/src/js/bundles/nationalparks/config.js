import Builder from './builder.js'

var name = 'National Parks'

export default {
	aspectLabel: name,
	dimensionNames: [name],
	dataToLoad: 'data.geojson',
	parser: Builder,
	attribution:
		'Office for National Statistics licensed under the (<a href="https://www.ons.gov.uk/methodology/geography/licences">OGL v.3.0</a>). Contains OS data © Crown copyright and database right',
	initialOutlineWidth: 1
}
