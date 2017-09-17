define(['./builder'],
	function(Builder) {
		var dimensionNames = ["National Trails"];
		
		var keys = [
			"Pennine Way",
			"Cleveland Way",
			"Offa's Dyke Path",
			"South Downs Way",
			"The Ridgeway",
			"South West Coast Path",
			"Yorkshire Wolds Way",
			"North Downs Way",
			"Peddar's Way and Norfolk Coast Path",
			"Thames Path",
			"Hadrian's Wall Path",
			"Cotswold Way",
			"Pennine Bridleway"
		];
		var urls = {};
		keys.forEach(function(key){
			var munged = key.replace(/^The /g, "").replace(/\s/g, "-").replace(/'/g, "").toLowerCase();
			urls[key] = 'http://www.nationaltrail.co.uk/' + munged;
		});
		
		return {
			dimensionNames: dimensionNames,
			dataToLoad: 'data.geojson',
			parser: Builder,
			attribution: 'Adapted from TODO',
			urls: urls
		};
	}
);
