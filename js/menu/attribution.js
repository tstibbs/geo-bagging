define(['jquery', 'leaflet'],
	function($, leaflet) {
		return leaflet.Class.extend({
			initialize: function(container) {
				this._container = container;
			},
			
			addAttribution: function(dataSourceName, text) {
				//capitalise source name, they're all lowercase by convention but this doesn't look very friendly
				dataSourceName = dataSourceName.charAt(0).toUpperCase() + dataSourceName.substr(1);
				var wrapper = $('<div class="attribution-entry"></div>');
				wrapper.append($('<span class="attribution-source"></span>').text(dataSourceName));
				wrapper.append($('<span></span>').html(text));
				this._container.append(wrapper);
			},
		});
	}
);
