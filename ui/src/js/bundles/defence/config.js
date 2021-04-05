import PointsBuilder from './points_builder.js'

var dimensionNames = ['Purpose', 'Type', 'Condition']

export default {
	aspectLabel: 'Defence of Britain',
	dimensionNames: dimensionNames,
	dataToLoad: 'data.json',
	parser: PointsBuilder,
	attribution:
		'"Defence of Britain" data &copy; <a href="https://doi.org/10.5284/1000327">Council for British Archaeology</a> 2006'
}
