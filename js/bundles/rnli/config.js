import PointsBuilder from './points_builder';

		var dimensionNames = ["Lifeboat Types", "Launch Methods"];

		var typeData = {
			'Atlantic85': ['Atlantic 85', 'b-class-lifeboat'],
			'Atlantic75': ['Atlantic 75', 'b-class-lifeboat'],
			'D': ['D class', 'd-class-lifeboat'],
			'H': ['H class', 'rescue-hovercraft'],
			'E': ['E class', 'e-class-lifeboat'],
			'Mersey': ['Mersey', 'mersey-class-lifeboat'],
			'Tyne': ['Tyne', 'tyne-class-lifeboat'],
			'Trent': ['Trent', 'trent-class-lifeboat'],
			'Tamar': ['Tamar', 'tamar-class-lifeboat'],
			'Severn': ['Severn', 'severn-class-lifeboat'],
			'Shannon': ['Shannon', 'shannon-class-lifeboat']
		};
		
		var baseUrl = "https://rnli.org/what-we-do/lifeboats-and-stations/our-lifeboat-fleet/";
		Object.keys(typeData).forEach(function(key) {
			var label = typeData[key]
			typeData[key] = [label[0], baseUrl + label[1]]
		});
		
		var typeLabels = {};
		Object.keys(typeData).forEach(function(key) {
			var label = typeData[key]
			typeLabels[key] = '<a href="' + label[1] + '">' + label[0] + '</a>';
		});
		
		var dimensionValueLabels = {};
		dimensionValueLabels[dimensionNames[0]] = typeLabels;
		dimensionValueLabels[dimensionNames[1]] = {
			'MooredAfloat': 'Moored Afloat',
			'FloatingHouse': 'Floating House',
			'FloatingCradle': 'Floating Cradle',
		};
		
		export default {
			aspectLabel: "RNLI",
			dimensionNames: dimensionNames,
			dimensionValueLabels: dimensionValueLabels,
			dataToLoad: 'data.json',
			parser: PointsBuilder,
			attribution: 'Contains <a href="https://hub.arcgis.com/datasets/7dad2e58254345c08dfde737ec348166_0">Open Data</a> licensed under the GIS Open Data Licence &copy; RNLI and data from <a href="https://en.wikipedia.org/wiki/List_of_RNLI_stations">Wikipedia</a>',
			typeData: typeData
		};
	
