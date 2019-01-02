define([
	'leaflet'
],
function(
	leaflet
) {
	return leaflet.Class.extend({
		initialize: function (manager) {
			this._manager = manager;
			this._colour = '#FF0000';
			this._layers = [];
		},

		showTracks: function(tracks) {			
			this._layers.forEach(function(layer) {
				layer.remove();
			});
			this._layers = tracks.map(function(features) {
				geoJsonLayer = leaflet.geoJSON(features, {
					color: this._colour,
					onEachFeature: function(feature, layer) {
						if (feature.properties && feature.properties.name) {
							layer.bindPopup(feature.properties.name);
						}
					}
				});
				geoJsonLayer.addTo(this._manager.getMap());
				return geoJsonLayer;
			}.bind(this));
		}
	});
});
