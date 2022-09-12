import FileLoadView from '../external-files/file_load_view.js'
import gpxBundle from '../../bundles/external-gpx/config.js'

const label = 'Upload GPX tracks to see markers around those tracks'

const configBundle = {
	...gpxBundle,
	aspectLabel: 'Tracks',
	colour: '#FF0000',
	loadLabel: label,
	loadExtensions: '.gpx'
}

var TrackLoadView = FileLoadView.extend({
	initialize: function (manager, constraintsView) {
		FileLoadView.prototype.initialize.call(this, manager, configBundle)
		this._constraintsView = constraintsView
	},

	_finishedReadingFiles: function (tracks) {
		var combinedBounds = tracks.map(function (track) {
			return track.bounds
		})
		this._constraintsView.limitTo(this, combinedBounds)
		FileLoadView.prototype._finishedReadingFiles.call(this, tracks)
	},

	reset: function () {
		this._fileInput.val('')
		this._filesView.hideOldLayers()
	}
})

export default TrackLoadView
