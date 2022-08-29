import {rawGpxToGeoJson} from '../../utils/geojson.js'

export default {
	aspectLabel: 'GPX Files',
	loadLabel: 'GPX',
	colour: 'pink',
	fileContentsParser: rawGpxToGeoJson
}
