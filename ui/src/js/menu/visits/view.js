import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet.js'
import {VisitsLoadView} from './visits_load_view.js'

export const VisitsMenuView = leaflet.Class.extend({
	initialize: function (manager) {
		this._manager = manager
		this._limitOriginView = null //the view that triggered the current limits
		this._view = $('<div></div>')
		var info = $(
			'<div class="info">This section allows you to upload an excel file listing all the POIs you have visited. This information will then be added to the category selectors to allow you to select POIs based on whether they have been visited, not visited, or both.</div>'
		)
		this._view.append(info)
		this._view.append('<hr class="info">')

		this._VisitsLoadView = new VisitsLoadView(manager, this)
		this._view.append(this._VisitsLoadView.getView())

		var reset = this._buildReset()
		this._view.append(reset)
	},

	_buildReset: function () {
		var wrapper = $('<div class="setting"></div>')
		var currentLocationLimitButton = $('<button type="button">Reset</button>')
		currentLocationLimitButton.click(this.reset.bind(this))
		wrapper.append(currentLocationLimitButton)
		return wrapper
	},

	setVisits: function (originView, visitData) {
		this._limitOriginView = originView
		this._manager.getVisitConstraintManager().setVisitConstraints(visitData)
	},

	reset: function () {
		if (this._limitOriginView != null) {
			this._limitOriginView.reset()
			this._limitOriginView = null
		}
		this._manager.getVisitConstraintManager().reset()
	},

	getView: function () {
		return this._view
	}
})
