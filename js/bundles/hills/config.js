define(['leaflet', './points_builder', 'custom_default_icon'],
	function(leaflet, PointsBuilder, CustomDefaultIcon) {

		var dimensionNames = ['Hills'];
		var dimensionValueLabels = {};
		dimensionValueLabels[dimensionNames[0]] = {
			'5': 'Dewey',
			'5D': 'Donald Dewey',
			'5H': 'Highland Five',
			'C': 'Corbett',
			'CouT': 'County Top',
			'D': 'Donald',
			'G': 'Graham',
			'Hew': 'Hewitt',
			'Hu': 'Hump',
			'M': 'Munro',
			'MT': 'Munro Top',
			'Ma': 'Marilyn',
			'N': 'Nutall',
			'SIB': 'Islands (SIBs)',
			'Sim': 'Simm',
			'TU': 'Tump',
			'W': 'Wainwright'
		};

		var redIconPath = window.os_map_base + 'img/hill.png';

		return {
			defaultIcon: new CustomDefaultIcon(redIconPath, {iconUrl: redIconPath}),
			dimensionNames: dimensionNames,
			dimensionValueLabels: dimensionValueLabels,
			dataToLoad: 'data.json',
			parser: PointsBuilder
		};
	}
);
