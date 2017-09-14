define(['./builder'],
	function(Builder) {
		var dimensionNames = ["National Trails"];
		
		return {
			dimensionNames: dimensionNames,
			dataToLoad: 'data.geojson',
			parser: Builder,
			attribution: 'Adapted from TODO',
		};
	}
);
