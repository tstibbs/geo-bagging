define(['jquery', 'leaflet'],
	function($, leaflet) {
		return leaflet.Class.extend({
			initialize: function(manager, map) {
				this._manager = manager;
				this._view = $('<div></div>');
				var info = $('<div class="info">This section allows you to limit how much data is displayed on screen. This can be useful for example when on older or mobile devices which may struggle to remain responsive if a large amount of data is loaded.</div>')
				this._view.append(info);
				this._view.append('<hr class="info">');
				var currentAreaLimit = $('<input type="checkbox">');
				
				var desc = $('<label>Limit new markers to current area</label>');
				desc.prepend(currentAreaLimit);
				this._view.append(desc);
				
				currentAreaLimit.change(function(event) {
					if (event.target.checked) {
						this._limitToCurrentView();
					} else {
						this._unlimit();
					}
				}.bind(this));
			},
			
			_limitToCurrentView: function() {
				this._manager.setViewConstraints(this._manager.getMap().getBounds());
			},
			
			_unlimit: function() {
				this._manager.setViewConstraints(null);
			},
			
			getView: function() {
				return this._view;
			}
		});
	}
);
