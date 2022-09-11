import {rawGpxToGeoJson} from '../../utils/geojson.js'

export default {
	aspectLabel: 'GPX Files',
	loadLabel: 'GPX',
	colour: '#bd007e', //dark pinky crimson
	initialOutlineWidth: 2,
	fileContentsParser: rawGpxToGeoJson
}
