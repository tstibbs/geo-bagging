define(['./points_builder'],
	function(PointsBuilder) {

		var dimensionNames = ["RNLI"];
		
		var dimensionValueLabels = {};
		dimensionValueLabels[dimensionNames[0]] = {
			'undefined': "Lifeboat Stations",
		};
		
		return {
			dimensionNames: dimensionNames,
			dimensionValueLabels: dimensionValueLabels,
			dataToLoad: 'data.json',
			parser: PointsBuilder
		};
	}
);
