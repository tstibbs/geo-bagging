import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet.js'
import FileFeaturesLoadView from './file_features_load_view.js'
import geojsonBundle from '../../bundles/external-geojson/config.js'
import gpxBundle from '../../bundles/external-gpx/config.js'

var ExternalFilesView = leaflet.Class.extend({
	initialize: function (manager) {
		this._view = $('<div></div>')
		var info = $(
			'<div class="info">Load external files to overlay on to map. Parsing is basic and limited information will be loaded - overlays will be mostly just visuals.</div>'
		)
		this._view.append(info)
		this._view.append('<hr class="info">')

		const geojsonLoadView = new FileFeaturesLoadView(manager, geojsonBundle)
		this._view.append(geojsonLoadView.getView())

		const gpxLoadView = new FileFeaturesLoadView(manager, gpxBundle)
		this._view.append(gpxLoadView.getView())
	},

	getView: function () {
		return this._view
	}
})

export default ExternalFilesView
