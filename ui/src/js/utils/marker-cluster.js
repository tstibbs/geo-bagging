import leaflet_cluster from 'VendorWrappers/leaflet-marker-cluster.js'
import $ from 'jquery'

import {ENABLE_CLUSTERING_EVENT, DISABLE_CLUSTERING_EVENT} from '../menu/settings/clustering_enabled_control.js'

export function buildMarkerClusterGroup(map, options = {}) {
	var mapElem = $('div#map')
	var radius = Math.max(mapElem[0].offsetHeight, mapElem[0].offsetWidth) / 10 //if map window is resized or changed (e.g. portrait to landscape) then this value will be out of date, but will still work ok so not worth the effort to update
	let clusterGroup = new leaflet_cluster.MarkerClusterGroup({
		...options, // must be first to override anything that follows
		disableClusteringAtZoom: 15,
		maxClusterRadius: radius,
		chunkedLoading: true
	})
	map.on(ENABLE_CLUSTERING_EVENT, () => {
		clusterGroup.enableClustering()
	})
	map.on(DISABLE_CLUSTERING_EVENT, () => {
		clusterGroup.disableClustering()
	})
	return clusterGroup
}
