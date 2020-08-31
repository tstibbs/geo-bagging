import leaflet from 'VendorWrappers/leaflet'
import PointsBuilder from './points_builder'

var dimensionNames = ['Follies']

var dimensionValueLabels = {}
dimensionValueLabels[dimensionNames[0]] = {
	Arch_Gateway: 'Arch/Gateway'
}

export default {
	aspectLabel: 'Follies',
	dimensionNames: dimensionNames,
	dimensionValueLabels: dimensionValueLabels,
	dataToLoad: 'data.json',
	parser: PointsBuilder,
	attribution:
		'Reproduced with the kind permission of Paul from <a href="http://www.follies.org.uk/follymaps.htm">The Folly Fellowship</a>'
}
