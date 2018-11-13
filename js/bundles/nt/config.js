define(['leaflet', './points_builder', 'custom_default_icon'],
	function(leaflet, PointsBuilder, CustomDefaultIcon) {

		var dimensionNames = ["Type", "Facilities"];
		
		var dimensionValueLabels = {};
		dimensionValueLabels[dimensionNames[0]] = {
			'houses-and-buildings': "Houses",
			'gardens-and-parks': "Gardens & parks",
			'countryside': "Countryside",
			'coast-and-beaches': "Coast & beaches",
			'castles-and-forts': "Castles & forts",
			'sites-and-monuments': "Sites & monuments",
			'churches-and-chapels': "Churches & chapels",
			'mills-and-mines': "Mills, forges & mines",
			'villages-and-pubs': "Villages & pubs"
		};
		dimensionValueLabels[dimensionNames[1]] = {
			'family-friendly': "Family-friendly",
			'dog-friendly': "Dog-friendly",
			'disabled-access': "Disabled access",
			'for-hard-of-hearing': "For deaf/hard of hearing",
			'for-visually-impaired': "For blind/visually impaired",
			'places-to-eat-and-drink': "Places to eat & drink",
			'ideal-for-group-visits': "Ideal for group visits",
			'available-for-weddings': "Available for weddings",
			'fifty-things': "50 things to do before you're 11 ¾"
		};
		
		return {
			aspectLabel: "National Trust",
			dimensionNames: dimensionNames,
			dimensionValueLabels: dimensionValueLabels,
			dataToLoad: 'data.json',
			parser: PointsBuilder
		};
	}
);
