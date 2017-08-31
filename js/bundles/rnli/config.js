define(['./points_builder'],
	function(PointsBuilder) {

		var dimensionNames = ["RNLI - Lifeboat Types", "RNLI - Launch Methods"];
		
		var dimensionValueLabels = {};
		dimensionValueLabels[dimensionNames[0]] = {
			'Atlantic85': 'Atlantic 85',
			'Atlantic75': 'Atlantic 75',
			'D': 'D class',
			'H': 'H class',
			'E': 'E class'
		};
		dimensionValueLabels[dimensionNames[1]] = {
			'MooredAfloat': 'Moored Afloat',
			'FloatingHouse': 'Floating House',
			'FloatingCradle': 'Floating Cradle',
		};
		
		return {
			dimensionNames: dimensionNames,
			dimensionValueLabels: dimensionValueLabels,
			dataToLoad: 'data.json',
			parser: PointsBuilder,
			attribution: 'Adapted from data &copy; RNLI and from wikipedia'
		};
	}
);
