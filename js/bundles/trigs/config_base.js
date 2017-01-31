define(['leaflet', 'conversion', './points_builder'],
	function(leaflet, conversion, pointsBuilder) {
		var dimensionNames = ['Trigs - type', 'Trigs - condition'];
		var dimensionValueKeys = ['Pillar', 'Bolt', 'Surface Block', 'Rivet', 'Buried Block', 'Cut', 'Other', 'Berntsen', 'FBM', 'Intersected Station', 'Disc', 'Brass Plate', 'Active station', 'Block', 'Concrete Ring', 'Curry Stool', 'Fenomark', 'Platform Bolt', 'Cannon', 'Spider', 'Pipe'];
		var dimensionValueLabels = {};
		var typeValueLabels = {};
		dimensionValueLabels[dimensionNames[0]] = typeValueLabels;

		dimensionValueKeys.forEach(function(value) {
			typeValueLabels[value] = '<a href="http://trigpointing.uk/wiki/' + value + '">' + value + '</a>';
		});

		return {
			icons: {
				Pillar: leaflet.icon({
					iconUrl: window.os_map_base + 'img/pillar.png',
					iconAnchor: [10, 40], // point of the icon which will correspond to marker's location
					popupAnchor: [1, -38] // point from which the popup should open relative to the iconAnchor
				})
			},
			dimensionNames: dimensionNames,
			dimensionValueLabels: dimensionValueLabels,
			parser: pointsBuilder
		};
	}
);
