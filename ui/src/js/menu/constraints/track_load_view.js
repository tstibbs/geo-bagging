import FileConstraintLoadView from './file-constraint-load-view.js'
import gpxBundle from '../../bundles/external-gpx/config.js'

const label = 'Upload GPX tracks to see markers around those tracks'

const configBundle = {
	...gpxBundle,
	aspectLabel: 'GPX Tracks',
	colour: '#FF0000', //red
	loadLabel: label
}

var TrackConstraintsLoadView = FileConstraintLoadView.extend({
	initialize: function (manager, constraintsView) {
		FileConstraintLoadView.prototype.initialize.call(this, manager, constraintsView, configBundle)
	}
})

export default TrackConstraintsLoadView
