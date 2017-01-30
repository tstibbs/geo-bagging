define(['./points_builder'],
	function(PointsBuilder) {

		var dimensionNames = ['Waymarks'];
		var dimensionValueLabels = {};
		dimensionValueLabels[dimensionNames[0]] = {
			'AA_Signs': 'AA Signs',
			'Boundary_Markers': 'Boundary Markers',
			'Canal_Milemarkers': 'Canal Milemarkers'
		};
		
		return {
			dimensionNames: dimensionNames,
			dimensionValueLabels: dimensionValueLabels,
			dataToLoad: 'data.json',
			parser: PointsBuilder
		};
	}
);
