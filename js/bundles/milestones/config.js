define(['./points_builder', 'custom_default_icon'],
	function(PointsBuilder, CustomDefaultIcon) {

		var dimensionNames = ['Waymarks'];
		var dimensionValueLabels = {};
		dimensionValueLabels[dimensionNames[0]] = {
			'AA_Signs': 'AA Signs',
			'Boundary_Markers': 'Boundary Markers',
			'Canal_Milemarkers': 'Canal Milemarkers'
		};
		
		var milestonesIcon = window.os_map_base + 'img/milestone.png';

		return {
			defaultIcon: new CustomDefaultIcon(milestonesIcon, {iconUrl: milestonesIcon}),
			dimensionNames: dimensionNames,
			dimensionValueLabels: dimensionValueLabels,
			dataToLoad: 'data.json',
			parser: PointsBuilder
		};
	}
);
