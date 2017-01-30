define(["leaflet", "jquery", "global", "params"],
	function(leaflet, $, global, params) {
		
		var defaultPageId = global.location.pathname.split("/").pop();
		
		var defaults = {
			cluster: true,
			dimensional_layering: false,
			initial_zoom: 13,
			start_position: [53.374694, -1.711474],//lat, long
			force_config_override: false,//if true, start position and zoom will be taken from config, not from local storage
			map_element_id: 'map',
			page_id: defaultPageId,
			show_selection_control: true,
			show_search_control: true,
			show_locate_control: true,
			show_layers_control: true,
			show_hider_control: 'mobile',// false, true, 'mobile'
			hider_control_start_visible: true,
			icons: {},
			dimensionNames: [],
			dimensionValueLabels: {},
			defaultLayer: "OS",
			markerConstraints: null //e.g. will constrain it to show only those markers within a bounding boc
		};

		var Config = leaflet.Class.extend({
			initialize: function (options, configBundles) {
				var resolvedConfig = $.extend({}, defaults, options);
				this._checkForUndefaultedProperties(options, "window config");
				resolvedConfig.bundles = configBundles;
				
				this._storageId = 'os_map:' + resolvedConfig.page_id + 'config';
				
				if (options == null || options.force_config_override !== true) {//check *options*, don't want to retrieve this persisted value
					//unless we've set the attribute to force override local config with the coded config, we should grab the local storage version and overwrite any matching keys
					var saved = this._getSavedConfig();
					resolvedConfig = $.extend({}, resolvedConfig, saved);
				}

				if (params('startPosition')) {//lat, long
					resolvedConfig.start_position = params('startPosition').split(',');
				}
				if (params('startZoom')) {
					resolvedConfig.initial_zoom = params('startZoom');
				}
				if (params('constraints')) {
					var points = params('constraints').split(','); //lat,lng,lat,lng
					var tlLat = parseFloat(points[0]);
					var tlLng = parseFloat(points[1]);
					var brLat = parseFloat(points[2]);
					var brLng = parseFloat(points[3]);
					resolvedConfig.markerConstraints = leaflet.latLngBounds([tlLat, tlLng], [brLat, brLng]);
				}
				
				//set all values locally so that the exporter object works like a hash
				for (var property in resolvedConfig) {
					if (resolvedConfig.hasOwnProperty(property)) {
						this[property] = resolvedConfig[property];
					}
				}
			},
			
			_checkForUndefaultedProperties: function(newConfig, source) {
				for (var property in newConfig) {
					if (newConfig.hasOwnProperty(property) && !defaults.hasOwnProperty(property)) {
						console.warn('Property "' + property + '" (set from ' + source + ') should have a default');
					}
				}
			},
			
			_getSavedConfig: function() {
				if (localStorage !== undefined) {
					var saved = localStorage.getItem(this._storageId);
					if (saved != null) {
						return JSON.parse(saved);
					} else {
						return null;
					}
				} else {
					return null;
				}
			},
			
			persist: function(options) {
				if (localStorage !== undefined) {
					var saved = this._getSavedConfig();
					if (saved != null) {
						options = $.extend({}, saved, options);
					}
					localStorage.setItem(this._storageId, JSON.stringify(options));
				}
			}
		});

		return Config;
	}
);
