define(['./points_builder'],
	function(PointsBuilder) {
		var dimensionNames = ["Type", "Condition"];
		return {
			aspectLabel: "Benchmarks",
			dimensionNames: dimensionNames,
			dataToLoad: 'data.json',
			parser: PointsBuilder,
			attribution: 'benchmarks'
		};
	}
);
