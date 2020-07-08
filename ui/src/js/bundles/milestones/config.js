import PointsBuilder from './points_builder';
import CustomDefaultIcon from '../../custom_default_icon';
import milestoneIcon from '../../../img/milestone.png'

var dimensionNames = ['Waymarks'];
var dimensionValueLabels = {};
dimensionValueLabels[dimensionNames[0]] = {
	'AA_Signs': 'AA Signs',
	'Boundary_Markers': 'Boundary Markers',
	'Canal_Milemarkers': 'Canal Milemarkers'
};

var milestonesIcon = milestoneIcon;

export default function build(config) {
	return {
		aspectLabel: "Waymarks",
		defaultIcon: new CustomDefaultIcon(config, milestonesIcon, {iconUrl: milestonesIcon}),
		dimensionNames: dimensionNames,
		dimensionValueLabels: dimensionValueLabels,
		dataToLoad: 'data.json',
		parser: PointsBuilder,
		attribution: '&copy; <a href="http://www.msocrepository.co.uk/">The Milestone Society</a>'
	}
};
