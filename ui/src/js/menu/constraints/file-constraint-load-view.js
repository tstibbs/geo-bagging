import FileFeaturesLoadView from '../external-files/file_features_load_view.js'

var FileConstraintLoadView = FileFeaturesLoadView.extend({
	initialize: function (manager, constraintsView, bundle) {
		FileFeaturesLoadView.prototype.initialize.call(this, manager, bundle)
		this._constraintsView = constraintsView
	},

	_finishedReadingFiles: function (tracks) {
		var combinedBounds = tracks.map(function (track) {
			return track.bounds
		})
		combinedBounds = combinedBounds.flat()
		this._constraintsView.limitToGeoJsonPolygons(this, combinedBounds)
		FileFeaturesLoadView.prototype._finishedReadingFiles.call(this, tracks)
	},

	reset: function () {
		this._fileInput.val('')
		this._filesView.hideOldLayers()
	}
})

export default FileConstraintLoadView
