define(['leaflet', 'jquery'],
	function(leaflet, $) {
		return {
			addTo: function(map) {
				var ajaxRequest = $.ajax({
					url: '../js/bundles/nationaltrails/data.geojson',
					dataType: 'json'
				}).done(function(data) {
					leaflet.geoJSON(data).addTo(map);
				}.bind(this));
			}
		}
	}
);
