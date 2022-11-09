import leaflet from 'VendorWrappers/leaflet.js'
import $ from 'jquery'

export const ENABLE_CLUSTERING_EVENT = 'enableClustering'
export const DISABLE_CLUSTERING_EVENT = 'disableClustering'

export const ClusteringEnabledControl = leaflet.Class.extend({
	initialize: function (manager) {
		const map = manager.getMap()

		this._view = $('<div class="setting"></div>')
		this._clusteringEnabled = $('<input type="checkbox" checked>')
		var desc = $('<label>Clustering enabled?</label>')
		desc.prepend(this._clusteringEnabled)

		this._clusteringEnabled.change(event => {
			if (event.target.checked) {
				map.fire(ENABLE_CLUSTERING_EVENT)
			} else {
				map.fire(DISABLE_CLUSTERING_EVENT)
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
