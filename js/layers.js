define(['leaflet', 'leaflet_bing', 'constants'],
	function(leaflet, Leaflet_bing, constants) {

        var defaults = {
            key: constants.bingKey,
            detectRetina: true
        };

		//OS
		var bingOsLayer = new Leaflet_bing(leaflet.extend({imagerySet: "OrdnanceSurvey", minZoom: 12, maxZoom: 18, maxNativeZoom: 17}, defaults));
		var bingFallbackLayer = new Leaflet_bing(leaflet.extend({imagerySet: "Road", maxZoom: 11, minZoom: 0}, defaults)); //fallback layer because the OS maps don't scale well when you zoom out
		var bingOsGroup = leaflet.layerGroup([bingOsLayer, bingFallbackLayer]);
        //Bing standard maps
        var bingDefaults = leaflet.extend({maxZoom: 18, minZoom: 0}, defaults)
		var bingRoads = new Leaflet_bing(leaflet.extend({imagerySet: "RoadOnDemand"}, bingDefaults));
		var bingHybrid = new Leaflet_bing(leaflet.extend({imagerySet: "AerialWithLabelsOnDemand"}, bingDefaults));
		var bingAerial = new Leaflet_bing(leaflet.extend({imagerySet: "Aerial"}, bingDefaults));
		//OSM
		var osm = new leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			minZoom: 0, maxZoom: 19, attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
		});
		
		var layers = {
			"OS": bingOsGroup,
			"Bing Roads": bingRoads,
			"Bing Satellite": bingAerial,
			"Bing Hybrid": bingHybrid,
			"OSM": osm
		};
		
		function _listenForLayerChange(layerId, layer, config) {
			layer.on('add', function() {
				config.persist({defaultLayer: layerId});
			}.bind(this));
		}

		return function(map, config) {
			//if we have a default layer set, select that now
			var layerToSelect = layers[config.defaultLayer];
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
