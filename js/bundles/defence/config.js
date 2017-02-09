define(['./points_builder'],
	function(PointsBuilder) {

		var dimensionNames = ['DOB'];

		return {
			dimensionNames: dimensionNames,
			dataToLoad: 'data.json',
			parser: PointsBuilder
		};
	}
);
