define(['jquery', 'map_loader', '../constants', '../params', '../map_view', './source_view', './hills_source_view', './extra_source_view', 'mobile', 'config', 'leaflet', 'leaflet_draw'],
    function($, mapLoader, constants, params, mapView, SourceView, HillsSourceView, ExtraSourceView, mobile, Config, leaflet, LeafletDraw) {
        var LandingPageView = leaflet.Class.extend({
			buildView: function() {
				var datasources = [].concat(constants.dataSources).sort();//don't want to modify the constant
				var bundles = mapLoader.getBundleIds().sort();
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
				view += '        <label><input type="checkbox" name="constraintsselect" value="constraintsselect">Enable selection</label>';
				view += '    </form>';
				view += '    <div id="map-container" class="hidden">';
				view += '    </div>';
				view += '</div>';
				
				this._view = $(view);
				var fieldset = $('fieldset', this._view);
				this._sources = [];
				this._extraSources = [];
				
				var createSources = function(sources, datasources) {
					var sourceViews = {};
					for (var i = 0; i < sources.length; i++) {
						var source = sources[i];
						var bundleBase = source.split('/', 1)[0];
						if (HillsSourceView.canDisplaySource(source)) {
							sourceViews[source] = new HillsSourceView(source, bundles);
						} else if (SourceView.canDisplaySource(source)) {
							sourceViews[source] = new SourceView(source, bundles);
						} else {
							this._extraSources.push(source);
						}
						if (datasources != null && datasources.indexOf(bundleBase) != -1) {
							datasources.splice(datasources.indexOf(bundleBase), 1);
						}
					}
					return sourceViews;
				}.bind(this);
				
				//create sources for all bundles
				var sourceViews = createSources(bundles, datasources);
				//now create sources for the remaining datasources
				$.extend(sourceViews, createSources(datasources, null));

				Object.keys(sourceViews).sort().forEach(function(source) {
					this._sources.push(sourceViews[source]);
				}.bind(this));

				this._extraSources.sort().forEach(function(source) {
					this._sources.push(new ExtraSourceView(source));
				}.bind(this));

				this._sources.forEach(function(source) {
					source.render(fieldset);
				}.bind(this));



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
					show_layers_control: false,
					show_position_control: false
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
				$('input[name="constraintsselect"]', this._view).click(function() {
					var enable = $(this).is(':checked');
					if (enable) {
						rect.enable();
					} else {
						rect.disable();
						if (mobile.isMobile()) {
							//hack because box drawing doesn't work with touch so we allow multiple boxes as a workaround
							drawnItems.clearLayers();
						}
					}
				});
				
				
				var constraints = params('constraints');
				if (constraints != null) {
					var bounds = (new Config()).markerConstraints;
					
					var shape = new leaflet.Rectangle(bounds, rect.options.shapeOptions);
					this._drawnItems.addLayer(shape);
				}

				map.on('draw:created', function (e) {
					var layer = e.layer;
					if (!mobile.isMobile()) {
						//hack because box drawing doesn't work with touch so we allow multiple boxes as a workaround
						drawnItems.clearLayers();
					}
					drawnItems.addLayer(layer);
				});
				
				mapLoader._finish();
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
				var selectedBundleIds = this._sources.map(function(source) {
					return source.getSelected();
				}).filter(function(source) {
					return source != null;
				});
				
				var remoteData = $('input[name="remoteData"]', this._view).is(':checked');
				
				var bounds = null;
				if ($('input[name="constraints"]', this._view).is(':checked') && this._drawnItems.getLayers().length > 0) {
					bounds = this._drawnItems.getBounds();
				}
				
				this.navigate(selectedBundleIds, bounds, remoteData);
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
