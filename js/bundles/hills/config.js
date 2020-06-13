import leaflet from 'VendorWrappers/leaflet';
import PointsBuilder from './points_builder';
import CustomDefaultIcon from '../../custom_default_icon';
import hillIcon from '../../../img/hill.png'

var dimensionNames = ['Hills'];
var dimensionValueLabels = {};
var hillValueLabels = {};
dimensionValueLabels[dimensionNames[0]] = hillValueLabels;

var displayNames = {
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
	'SIB': 'Island (SIB)',
	'Sim': 'Simm',
	'TU': 'Tump',
	'W': 'Wainwright'
};
var urlPaths = {
	'5': 'Deweys',
	'5D': 'HighlandFives',
	'5H': 'HighlandFives',
	'C': 'Corbetts',
	'CouT': 'CountyTops',
	'D': 'Donalds',
	'G': 'Grahams',
	'Hew': 'Hewitts',
	'Hu': 'HuMPs',
	'M': 'Munros',
	'MT': 'Munros',
	'Ma': 'Marilyns',
	'N': 'Nuttalls',
	'SIB': 'SIBs',
	'Sim': 'Simms',
	'TU': 'Tumps',
	'W': 'Wainwrights'
};

Object.keys(displayNames).forEach(function(key) {
	hillValueLabels[key] = '<a href="http://www.hill-bagging.co.uk/' + urlPaths[key] + '.php">' + displayNames[key] + '</a>';
});

var redIconPath = hillIcon

export default {
	aspectLabel: "Hills",
	defaultIcon: new CustomDefaultIcon(redIconPath, {iconUrl: redIconPath}),
	dimensionNames: dimensionNames,
	dimensionValueLabels: dimensionValueLabels,
	hillDisplayNames: displayNames,
	dataToLoad: 'data.json',
	parser: PointsBuilder,
	attribution: '&copy; <a href="http://www.hills-database.co.uk/downloads.html">The Database of British and Irish Hills</a>'
};
