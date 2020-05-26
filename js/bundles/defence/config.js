define(['./points_builder'],
	function(PointsBuilder) {

		var dimensionNames = ['Purpose', 'Type', 'Condition'];

		return {
			aspectLabel: "Defence of Britain",
			dimensionNames: dimensionNames,
			dataToLoad: 'data.json',
			parser: PointsBuilder,
			attribution: '"Defence of Britain" data &copy; <a href="https://doi.org/10.5284/1000327">Council for British Archaeology</a> 2006'
		};
	}
);
