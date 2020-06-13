import $ from 'jquery';
	export default leaflet.Class.extend({
		initialize: function (manager, constraintsView) {
			this._manager = manager;
			this._constraintsView = constraintsView;

			this._view = $('<div class="setting"></div>');
			this._currentAreaLimit = $('<input type="checkbox">');
			var desc = $('<label>Limit new markers to current area</label>');
			desc.prepend(this._currentAreaLimit);
			
			this._currentAreaLimit.change(function(event) {
				if (event.target.checked) {
					this._constraintsView.limitTo(this, this._manager.getMap().getBounds());
				} else {
					this._constraintsView.unlimit();
				}
			}.bind(this));
			
			this._view.append(desc);
		},
		
		getView: function() {
			return this._view;
		},
		
		reset: function() {
			this._currentAreaLimit.prop('checked', false);
		}
	});

