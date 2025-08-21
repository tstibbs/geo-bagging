import PointsBuilder from './points_builder.js'

var dimensionNames = ['Type']

export default {
	aspectLabel: 'Coastal Landmarks',
	dimensionNames: dimensionNames,
	dataToLoad: 'data.json',
	parser: PointsBuilder
}
