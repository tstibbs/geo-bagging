import {rawGeoJsonToGeoJson} from '../../utils/geojson.js'

export default {
	aspectLabel: 'GeoJson Files',
	loadLabel: 'GeoJson',
	loadExtensions: '.geojson',
	colour: 'darkblue',
	initialOutlineWidth: 1,
	fileContentsParser: rawGeoJsonToGeoJson
}
