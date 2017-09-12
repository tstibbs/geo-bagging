define(['./builder'],
	function(Builder) {		
		return {
			dataToLoad: 'data.geojson',
			parser: Builder,
			attribution: 'Adapted from TODO',
			displayLabel: 'National Trails'
		};
	}
);
