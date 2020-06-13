import PointsBuilder from './points_builder';
		var dimensionNames = ["Type"];
		export default {
			aspectLabel: "Coastal Landmarks",
			dimensionNames: dimensionNames,
			dataToLoad: 'data.json',
			parser: PointsBuilder,
			attribution: 'Adapted from data from <a href="https://en.wikipedia.org">Wikipedia</a> licenced under <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC&nbsp;BY&#8209;SA</a>'
		};
	
