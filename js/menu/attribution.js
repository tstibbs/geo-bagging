define(['jquery', 'leaflet'],
	function($, leaflet) {
		return leaflet.Class.extend({
			initialize: function(container) {
				this._container = container;
			},
			
			addAttribution: function(dataSourceName, text) {
				var wrapper = $('<div class="attribution-entry"></div>');
				wrapper.append($('<span class="attribution-source"></span>').text(dataSourceName));
				wrapper.append($('<span></span>').html(text));
				this._container.append(wrapper);
			},
		});
	}
);
