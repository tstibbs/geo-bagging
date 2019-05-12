define([
	'jquery',
	'leaflet',
	'constants'
],
	function(
		$,
		leaflet,
		constants
	) {
		return leaflet.Class.extend({
			initialize: function(manager) {
				this._view = $('<div class="setting"></div>');
				if (!manager.isAuthenticated()) {
					this._view.append($('<a href="' + constants.backendBaseUrl + 'login">Click here to log in</a>'));
				}
			},
		
			getView: function() {
				return this._view;
			}
		});
	}
);
