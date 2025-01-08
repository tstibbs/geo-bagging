import PointsBuilder from './points_builder.js'
import {labels, links} from './classifications.js'
import CustomDefaultIcon from '../../custom_default_icon.js'
import hillIcon from '../../../img/hill.png'

var displayNames = {
	...labels,
	//compatibility with the reduced data set, until it's fixed up
	CouT: 'County Top',
	TU: 'Tump'
}
var urlPaths = {
	...links,
	//compatibility with the reduced data set, until it's fixed up
	CouT: 'http://www.hill-bagging.co.uk/CountyTops.php',
	TU: 'http://www.hill-bagging.co.uk/Tumps.php'
}

var dimensionNames = ['Hills']
var dimensionValueLabels = {}
var hillValueLabels = {...displayNames}
dimensionValueLabels[dimensionNames[0]] = hillValueLabels

Object.keys(displayNames)
	.filter(key => key in urlPaths)
	.forEach(key => {
		hillValueLabels[key] = '<a href="' + urlPaths[key] + '">' + displayNames[key] + '</a>'
	})

var redIconPath = hillIcon

export default function build(config) {
	return {
		aspectLabel: 'Hills',
		defaultIcon: new CustomDefaultIcon(redIconPath, {
			iconUrl: redIconPath
		}),
		dimensionNames: dimensionNames,
		dimensionValueLabels: dimensionValueLabels,
		hillDisplayNames: displayNames,
		dataToLoad: 'data.json',
		parser: PointsBuilder,
		attribution:
			'&copy; <a href="http://www.hills-database.co.uk/downloads.html">The Database of British and Irish Hills</a>'
	}
}
