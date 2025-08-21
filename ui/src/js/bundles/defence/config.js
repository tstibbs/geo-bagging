import PointsBuilder from './points_builder.js'

var dimensionNames = ['Purpose', 'Type', 'Condition']

export default {
	aspectLabel: 'Defence of Britain',
	dimensionNames: dimensionNames,
	dataToLoad: 'data.json',
	parser: PointsBuilder
}
