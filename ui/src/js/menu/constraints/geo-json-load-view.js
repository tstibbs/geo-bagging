import FileConstraintLoadView from './file-constraint-load-view.js'
import geojsonBundle from '../../bundles/external-geojson/config.js'

const label = 'Upload a GeoJSON file to see markers within the polygons specified in the geojson file'

const configBundle = {
	...geojsonBundle,
	aspectLabel: 'GeoJson Constraints',
	style: {
		...geojsonBundle.style,
		color: 'orange'
	},
	loadLabel: label
}

export const GeoJsonConstraintLoadView = FileConstraintLoadView.extend({
	initialize: function (manager, constraintsView) {
		FileConstraintLoadView.prototype.initialize.call(this, manager, constraintsView, configBundle)
	}
})
