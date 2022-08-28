import FilesView from '../external-files/files_view.js'
import FileLoadView from '../external-files/file_load_view.js'
import {gpxToGeoJson, calcGeoJsonBounds} from '../../utils/geojson.js'

const label = 'Upload GPX tracks to see markers around those tracks'
const sourceName = 'Tracks'
const colour = '#FF0000'

var TrackLoadView = FileLoadView.extend({
	initialize: function (manager, constraintsView) {
		FileLoadView.prototype.initialize.call(this, label)
		this._constraintsView = constraintsView
		this._tracksView = new FilesView(manager, sourceName, colour)
	},

	_finishedReadingFiles: function (tracks) {
		var bounds = tracks.map(function (track) {
			return track.bounds
		})
		this._constraintsView.limitTo(this, bounds)
		this._tracksView.showNewLayers(tracks)
	},

	_parseFileContents: function (fileContents) {
		var geoJson = gpxToGeoJson(fileContents)
		var bounds = calcGeoJsonBounds(geoJson)
		return {
			features: geoJson,
			bounds: bounds
		}
	},

	reset: function () {
		this._fileInput.val('')
		this._tracksView.hideOldLayers()
	}
})

export default TrackLoadView
