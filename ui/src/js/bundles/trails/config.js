import Builder from './builder.js'

var dimensionNames = ['National Trails']

var keys = [
	'Pennine Way',
	'Cleveland Way',
	"Offa's Dyke Path",
	'South Downs Way',
	'The Ridgeway',
	'South West Coast Path',
	'Yorkshire Wolds Way',
	'North Downs Way',
	"Peddar's Way and Norfolk Coast Path",
	'Thames Path',
	"Hadrian's Wall Path",
	'Cotswold Way',
	'Pennine Bridleway',
	'England Coast Path',
	"Glyndŵr's Way"
]
var urls = {}
keys.forEach(function (key) {
	var munged = key.replace(/^The /g, '').replace(/\s/g, '-').replace(/'/g, '').replace(/ŵ/g, 'w').toLowerCase()
	urls[key] = 'http://www.nationaltrail.co.uk/' + munged
})
urls['Wales Coast Path'] = 'http://www.walescoastpath.gov.uk'

export default {
	aspectLabel: 'National Trails',
	dimensionNames: dimensionNames,
	dataToLoad: 'data.geojson',
	parser: Builder,
	attribution:
		'Natural England Open Data (<a href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/">OGL</a>)',
	urls: urls
}
