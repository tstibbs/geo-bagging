import FileLoadView from '../external-files/file_load_view.js'

var FileConstraintLoadView = FileLoadView.extend({
	initialize: function (manager, constraintsView, bundle) {
		FileLoadView.prototype.initialize.call(this, manager, bundle)
		this._constraintsView = constraintsView
	},

	_finishedReadingFiles: function (tracks) {
		var combinedBounds = tracks.map(function (track) {
			return track.bounds
		})
		combinedBounds = combinedBounds.flat()
		this._constraintsView.limitTo(this, combinedBounds)
		FileLoadView.prototype._finishedReadingFiles.call(this, tracks)
	},

	reset: function () {
		this._fileInput.val('')
		this._filesView.hideOldLayers()
	}
})

export default FileConstraintLoadView
