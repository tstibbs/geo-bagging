import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet.js'
import {ClusteringEnabledControl} from './clustering_enabled_control.js'

var SettingsView = leaflet.Class.extend({
	initialize: function (manager) {
		this._view = $('<div></div>')

		var clusteringEnabledControl = new ClusteringEnabledControl(manager)
		this._view.append(clusteringEnabledControl.getView())
	},

	getView: function () {
		return this._view
	}
})

export default SettingsView
