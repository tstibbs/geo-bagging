import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet.js'
import FileLoadView from './file_load_view.js'
import gpxBundle from '../../bundles/external-gpx/config.js'

var ExternalFilesView = leaflet.Class.extend({
	initialize: function (manager) {
		this._view = $('<div></div>')
		var info = $(
			'<div class="info">Load external files to overlay on to map. Parsing is basic and limited information will be loaded - overlays will be mostly just visuals.</div>'
		)
		this._view.append(info)
		this._view.append('<hr class="info">')

		const gpxLoadView = new FileLoadView(manager, gpxBundle)
		this._view.append(gpxLoadView.getView())
	},

	getView: function () {
		return this._view
	}
})

export default ExternalFilesView
