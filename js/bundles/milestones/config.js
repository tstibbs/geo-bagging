import PointsBuilder from './points_builder';
import CustomDefaultIcon from 'custom_default_icon';

		var dimensionNames = ['Waymarks'];
		var dimensionValueLabels = {};
		dimensionValueLabels[dimensionNames[0]] = {
			'AA_Signs': 'AA Signs',
			'Boundary_Markers': 'Boundary Markers',
			'Canal_Milemarkers': 'Canal Milemarkers'
		};
		
		var milestonesIcon = window.os_map_base + 'img/milestone.png';

		export default {
			aspectLabel: "Waymarks",
			defaultIcon: new CustomDefaultIcon(milestonesIcon, {iconUrl: milestonesIcon}),
			dimensionNames: dimensionNames,
			dimensionValueLabels: dimensionValueLabels,
			dataToLoad: 'data.json',
			parser: PointsBuilder,
			attribution: '&copy; <a href="http://www.msocrepository.co.uk/">The Milestone Society</a>'
		};
	
