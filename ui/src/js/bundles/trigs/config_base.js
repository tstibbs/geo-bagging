import pointsBuilder from './points_builder.js'
import CustomDefaultIcon from '../../custom_default_icon.js'
import pillarIcon from '../../../img/pillar.png'
import constants from '../../constants.js'

var dimensionNames = ['Type', 'Condition']
var dimensionValueKeys = [
	'Pillar',
	'Bolt',
	'Surface Block',
	'Rivet',
	'Buried Block',
	'Cut',
	'Other',
	'Berntsen',
	'FBM',
	'Intersected Station',
	'Disc',
	'Brass Plate',
	'Active station',
	'Block',
	'Concrete Ring',
	'Curry Stool',
	'Fenomark',
	'Platform Bolt',
	'Cannon',
	'Spider',
	'Pipe'
]
var dimensionValueLabels = {}
var typeValueLabels = {}
dimensionValueLabels[dimensionNames[0]] = typeValueLabels

dimensionValueKeys.forEach(function (value) {
	typeValueLabels[value] = '<a href="http://trigpointing.uk/wiki/' + value + '">' + value + '</a>'
})

export default function build(config) {
	return {
		aspectLabel: 'Trig Points',
		icons: {
			Pillar: new CustomDefaultIcon(pillarIcon, {
				iconUrl: pillarIcon,
				iconAnchor: [10, 40], // point of the icon which will correspond to marker's location
				popupAnchor: [1, -38] // point from which the popup should open relative to the iconAnchor
			})
		},
		dimensionNames: dimensionNames,
		dimensionValueLabels: dimensionValueLabels,
		parser: pointsBuilder,
		dataLocationUrlPrefix: constants.dataBackendBaseUrl
	}
}
