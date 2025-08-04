import Builder from './builder.js'

var name = 'Counties'

const attribution =
	'Office for National Statistics licensed under the (<a href="https://www.ons.gov.uk/methodology/geography/licences">OGL v.3.0</a>) and Tailte Éireann licensed under (<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>). Contains OS data © Crown copyright and database right ' +
	new Date().getFullYear()

export default {
	aspectLabel: name,
	dimensionNames: [name],
	dataToLoad: 'data.geojson',
	parser: Builder,
	attribution,
	style: {
		initialOutlineWidth: 1,
		fillOpacity: 0
	}
}
