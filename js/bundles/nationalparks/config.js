define(['./builder'],
	function(Builder) {
		var name = "National Parks";

		return {
			aspectLabel: name,
			dimensionNames: [name],
			dataToLoad: 'data.geojson',
			parser: Builder,
			attribution: 'Office for National Statistics (<a href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/">OGL</a>)'
		};
	}
);
