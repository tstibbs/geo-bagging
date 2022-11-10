import leaflet from 'VendorWrappers/leaflet.js'
import $ from 'jquery'
import {ZOOM_OUT_EVENT} from '../../leaflet-plugins/zoom-detector.js'

export const ENABLE_CLUSTERING_EVENT = 'enableClustering'
export const DISABLE_CLUSTERING_EVENT = 'disableClustering'

export const ClusteringEnabledControl = leaflet.Class.extend({
	initialize: function (manager) {
		const map = manager.getMap()

		this._view = $('<div class="setting"></div>')
		this._clusteringEnabled = $('<input type="checkbox" checked>')
		var desc = $('<label>Clustering enabled?</label>')
		desc.prepend(this._clusteringEnabled)

		let lastDisabledZoomLevel = null
		this._clusteringEnabled.on('change', event => {
			if (event.target.checked) {
				lastDisabledZoomLevel = null
				map.fire(ENABLE_CLUSTERING_EVENT)
			} else {
				lastDisabledZoomLevel = map.getZoom()
				map.fire(DISABLE_CLUSTERING_EVENT)
			}
		})
		//re-enable clustering if map is zoomed out past the level at which clustering was disabled, as this is quite likely to bring too many markers on to the screen - clustering can easily be re-disabled if desired.
		//note the zoom detector can only detect once zoom has started, thus we might not actually get to renable clustering until after the zoom has taken place.
		map.on(ZOOM_OUT_EVENT, () => {
			let currentZoom = map.getZoom()
			//low numbers are "zoomed out"
			if (lastDisabledZoomLevel != null && currentZoom < lastDisabledZoomLevel) {
				//tick the box in the UI and then trigger the event so that the listeners above will actually renable clustering
				this._clusteringEnabled.prop('checked', true).trigger('change')
			}
		})

		this._view.append(desc)

		var clusteringInfo = $(
			'<div>Disable clustering with care! Disabling clustering when there are a large number of markers on screen could slow down or even crash your browser, particularly on mobile devices. Similarly, even if there are not a large number of markers currently visible, you may still have a problem if you disable clustering and then perform an action which brings more markers in to view (e.g. zooming out, adding data sources or simply panning to a location with more markers).</div>'
		)
		this._view.append(clusteringInfo)
	},

	getView: function () {
		return this._view
	}
})
