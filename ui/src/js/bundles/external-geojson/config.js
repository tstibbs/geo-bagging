import {rawGeoJsonToGeoJson} from '../../utils/geojson.js'

export default {
	aspectLabel: 'GeoJson Files',
	loadLabel: 'GeoJson',
	loadExtensions: '.geojson',
	style: {
		color: 'darkblue',
		initialOutlineWidth: 1
	},
	fileContentsParser: rawGeoJsonToGeoJson
}
