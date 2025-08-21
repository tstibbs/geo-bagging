import leaflet from 'VendorWrappers/leaflet.js'
import PointsBuilder from './points_builder.js'

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
	parser: PointsBuilder
}
