define(['leaflet', 'leaflet_bing'],
	function(leaflet, Leaflet_bing) {

		var bingKey = "AgYJwt3nv3bZyK31EDXorMaO8aIix-5kAa32O5TTwFAhdVYtZdIKhw3ttntsmgqy";
		
		//OS
		var bingOsLayer = new Leaflet_bing(bingKey, {type: "OrdnanceSurvey", minZoom: 12, maxZoom: 18, maxNativeZoom: 17});
		var bingFallbackLayer = new Leaflet_bing(bingKey, {type: "Road", maxZoom: 11, minZoom: 0}); //fallback layer because the OS maps don't scale well when you zoom out
		var bingOsGroup = leaflet.layerGroup([bingOsLayer, bingFallbackLayer]);
		//Bing road maps
		var bingRoads = new Leaflet_bing(bingKey, {type: "Road", maxZoom: 18, minZoom: 0});
		//OSM
		var osm = new leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			minZoom: 0, maxZoom: 19, attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
		});
		
		var layers = {
			"OS":bingOsGroup,
			"Bing Roads": bingRoads,
			"OSM": osm
		};
		
		function _listenForLayerChange(layerId, layer, config) {
			layer.on('add', function() {
				config.persist({defaultLayer: layerId});
			}.bind(this));
		}

		return function(map, config) {
			//if we have a default layer set, select that now
			var layerToSelect = layers[config.defaultLayer]
			if (layerToSelect != null) {
				layerToSelect.addTo(map);
			} else {
				bingOsGroup.addTo(map);
			}

			//set up listener to persist which layer is selected
			for (var id in layers) {
				_listenForLayerChange(id, layers[id], config);
			}
			
			return layers;
		};
	}
);
