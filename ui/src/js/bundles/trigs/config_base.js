import leaflet from 'VendorWrappers/leaflet';
import pointsBuilder from './points_builder';
import CustomDefaultIcon from '../../custom_default_icon';
import pillarIcon from '../../../img/pillar.png'

var dimensionNames = ['Type', 'Condition'];
var dimensionValueKeys = ['Pillar', 'Bolt', 'Surface Block', 'Rivet', 'Buried Block', 'Cut', 'Other', 'Berntsen', 'FBM', 'Intersected Station', 'Disc', 'Brass Plate', 'Active station', 'Block', 'Concrete Ring', 'Curry Stool', 'Fenomark', 'Platform Bolt', 'Cannon', 'Spider', 'Pipe'];
var dimensionValueLabels = {};
var typeValueLabels = {};
dimensionValueLabels[dimensionNames[0]] = typeValueLabels;

dimensionValueKeys.forEach(function(value) {
	typeValueLabels[value] = '<a href="http://trigpointing.uk/wiki/' + value + '">' + value + '</a>';
});

export default function build(config) {
	return {
		aspectLabel: "Trig Points",
		icons: {
			Pillar: new CustomDefaultIcon(config, pillarIcon, {
				iconUrl: pillarIcon,
				iconAnchor: [10, 40], // point of the icon which will correspond to marker's location
				popupAnchor: [1, -38] // point from which the popup should open relative to the iconAnchor
			})
		},
		dimensionNames: dimensionNames,
		dimensionValueLabels: dimensionValueLabels,
		parser: pointsBuilder,
		attribution: '&copy; <a href="http://trigpointing.uk">trigpointing.uk</a> and licenced by Ordnance Survey under the <a href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Open Government Licence</a>.'
	}
};
