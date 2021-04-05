import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet.js'
import constants from '../constants.js'

var UserMenu = leaflet.Class.extend({
	initialize: function (manager) {
		this._view = $('<div class="setting"></div>')
		if (manager.isAuthenticated()) {
			this._view.append($('<span>Logged in as ' + manager.getLoggedInUser() + '</span>'))
		} else {
			this._view.append($('<a href="' + constants.backendBaseUrl + 'login">Click here to log in</a>'))
		}
	},

	getView: function () {
		return this._view
	}
})

export default UserMenu
