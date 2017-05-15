define(['jquery', 'map_loader', 'constants', 'params', 'map_view', 'leaflet', 'leaflet_draw'],
    function($, mapLoader, constants, params, mapView, leaflet, LeafletDraw) {
        var LandingPageView = leaflet.Class.extend({
			buildView: function() {
				var datasources = constants.dataSources;
				var bundles = mapLoader.getBundleIds();
				var remoteData = params('remoteData') != null;
				var constraints = params('constraints');
				
				var view = '';
				view += '<div id="container" class="landing-container">';
				view += '    <form action="#">';
				view += '        <fieldset>';
				view += '            <legend>Data sources</legend>';
				view += '        </fieldset>';
				view += '        <label><input type="checkbox" name="remoteData" value="remoteData">Remote data? (for developing on a mobile device)</label>';
				view += '        <br />';
				view += '        <input type="submit" value="Load map">';
				view += '        <br />';
				view += '        <label><input type="checkbox" name="constraints" value="constraints">Limit markers by area?</label>';
				view += '    </form>';
				view += '    <div id="map-container" class="hidden">';
				view += '    </div>';
				view += '</div>';
				
				this._view = $(view);
				
				for (var i = 0; i < datasources.length; i++) {
					var source = datasources[i];
					var label = $('<label></label>');
					var input = $('<input></input>');
					input.attr('type', 'checkbox');
					input.attr('name', source);
					input.attr('value', source);
					if (bundles.indexOf(source) != -1) {
						input.attr('checked', 'true');
					}
					label.append(input);
					label.append(source);
					$('fieldset', this._view).append(label);
					$('fieldset', this._view).append($('<br />'));
				}

				if (remoteData) {
					$('input[name="remoteData"]', this._view).attr('checked', 'true');
				}
				
				$('body').addClass('landing');
				$('body').append(this._view);
				
				if (constraints != null) {
					$('input[name="constraints"]', this._view).attr('checked', 'true');
					this.showHideMap(true);
				}
			},
			
			showHideMap: function(showMap) {
				if (showMap) {
					if (!this._mapLoaded) {
						this.buildMap();
						this._mapLoaded = true;
					}
					$('#map-container', this._view).removeClass('hidden');
				} else {
					$('#map-container', this._view).addClass('hidden');
				}
			},
			
			initViewHandlers: function() {
				var _showHideMap = this.showHideMap.bind(this);
				$('input[name="constraints"]', this._view).click(function() {
					var showMap = $(this).is(':checked');
					_showHideMap(showMap);
				});
			},
			
			buildMap: function() {
				var osMap = mapLoader._buildMap({
					map_style: 'embedded',
					map_outer_container_element: $('div#map-container', this._view),
					show_zoom_control: false,
					show_selection_control: false,
					show_hider_control: false,
					show_layers_control: false
				});
				var map = osMap.getMap();
				var bounds = new leaflet.LatLngBounds([49.872, -10.568], [60.849, 1.774]); //southWest, northEast
				map.fitBounds(bounds);
				map.boxZoom.disable();
				map.doubleClickZoom.disable();
				
				var drawnItems = new leaflet.FeatureGroup();
				this._drawnItems = drawnItems;
				map.addLayer(drawnItems);
				var rect = new LeafletDraw.Rectangle(map, {
					repeatMode: true
				});
				rect.enable();
				
				var constraints = params('constraints');
				if (constraints != null) {
					var points = constraints.split(',');
					var north = parseFloat(points[0]);
					var west = parseFloat(points[1]);
					var south = parseFloat(points[2]);
					var east = parseFloat(points[3]);
					var bounds = leaflet.latLngBounds([south, west], [north, east]); //<LatLng> southWest, <LatLng> northEast
					
					var shape = new leaflet.Rectangle(bounds, rect.options.shapeOptions);
					this._drawnItems.addLayer(shape);
				}

				map.on('draw:created', function (e) {
					var layer = e.layer;
					drawnItems.clearLayers();
					drawnItems.addLayer(layer);
				});
				
				mapLoader._finishLoading();
			},
			
			navigate: function(bundleIds, bounds, remoteData) {
				var href = 'index.html';
				href += '?datasources=' + bundleIds.join(',');
				if (remoteData === true) {
					href += '&remoteData=true';
				}
				
				if (bounds != null) {
					var boundsString = [bounds.getNorth(), bounds.getWest(), bounds.getSouth(), bounds.getEast()].join(',');
					href += '&constraints=' + boundsString;
				}
				
				
				
				var mainMapUrl = href + '&skipLandingPage=true';
				var landingUrl = href + '&skipLandingPage=false';//TODO remove this once the landing page is the default
				
				//first push history, so that when the user clicks 'back' it preserves their choices (there are cleaverer ways to do this, but this way allows bookmarking)
				history.pushState({}, "GeoBagging - Landing", landingUrl);
				
				//now actually change page to show the full map
				document.location.href = mainMapUrl;
			},
			
			loadMainMap: function() {
				var bundleIds = $.makeArray($('fieldset input:checked', this._view).map(function(index, input) {
					return $(input).attr('value');
				}));
				var remoteData = $('input[name="remoteData"]', this._view).is(':checked');
				
				var bounds = null;
				if ($('input[name="constraints"]', this._view).is(':checked') && this._drawnItems.getLayers().length > 0) {
					bounds = this._drawnItems.getLayers()[0].getBounds();
				}
				
				this.navigate(bundleIds, bounds, remoteData);
			},
			
			initialize: function() {
				this.buildView();
				this.initViewHandlers();
				var _loadMainMap = this.loadMainMap.bind(this);

				this._view.submit(function(event) {
					event.preventDefault();
					_loadMainMap();
					return false;
				});
			}
		});
		return LandingPageView;
    }
);
