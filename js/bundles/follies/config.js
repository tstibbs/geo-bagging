define(['leaflet', './points_builder'],
	function(leaflet, PointsBuilder) {

		var dimensionNames = ['Follies'];
		
		var dimensionValueLabels = {};
		dimensionValueLabels[dimensionNames[0]] = {
			'Arch_Gateway': 'Arch/Gateway'
		};

		return {
			dimensionNames: dimensionNames,
			dimensionValueLabels: dimensionValueLabels,
			dataToLoad: 'data.json',
			parser: PointsBuilder,
			attribution: 'Follies data reproduced with the kind permission of Paul from <a href="http://www.follies.org.uk/follymaps.htm">The Folly Fellowship</a>'
		};
	}
);
