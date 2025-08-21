import PointsBuilder from './points_builder.js'
import constants from '../../constants.js'

var dimensionNames = ['Type', 'Facilities']

var dimensionValueLabels = {}
dimensionValueLabels[dimensionNames[0]] = {
	'castles-and-forts': 'Castles \u0026 forts',
	'churches-and-chapels': 'Churches \u0026 chapels',
	'coast-and-beaches': 'Coast \u0026 beaches',
	countryside: 'Countryside',
	'gardens-and-parks': 'Gardens \u0026 parks',
	'houses-and-buildings': 'Houses',
	'mills-and-mines': 'Mills, forges \u0026 mines',
	'sites-and-monuments': 'Sites \u0026 monuments',
	'villages-and-pubs': 'Villages \u0026 pubs'
}
dimensionValueLabels[dimensionNames[1]] = {
	'available-for-weddings': 'Available for weddings',
	blossom: 'Blossom',
	'disabled-access': 'Disabled access',
	'dog-friendly': 'Dog-friendly',
	'family-friendly': 'Family-friendly',
	'fifty-things': "50 things to do before you're 11 ¾",
	'for-hard-of-hearing': 'For deaf/hard of hearing',
	'for-visually-impaired': 'For blind/visually impaired',
	'ideal-for-group-visits': 'Ideal for group visits',
	'places-to-eat-and-drink': 'Places to eat \u0026 drink'
}

export default {
	aspectLabel: 'National Trust',
	dimensionNames: dimensionNames,
	dimensionValueLabels: dimensionValueLabels,
	dataToLoad: 'data.json',
	parser: PointsBuilder,
	dataLocationUrlPrefix: constants.dataBackendBaseUrl
}
