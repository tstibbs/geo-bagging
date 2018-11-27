define([
	'leaflet',
	'leaflet_controlHider',
	'selection',
	'locate',
	'mobile',
	'leaflet_geosearch',
	'leaflet_geosearch_bing',
	'mouseposition_osgb',
	'screenposition_osgb',
	'constants',
	'./menu/view',
	'leaflet_matrixlayers'
],
	function(
		leaflet,
		Leaflet_ControlHider,
		Selection,
		Locate,
		mobile,
		Leaflet_Geosearch,
		Leaflet_Geosearch_Bing,
		Mouseposition_Osgb,
		Screenposition_Osgb,
		constants,
		MenuView,
		Leaflet_MatrixLayers
	) {

		//even if some items aren't used in this particular configuration, we'll stick to a given order (resulting gaps are fine)
		var order = [
			Leaflet_ControlHider,
			MenuView,
			leaflet.Control.Zoom,
			Locate,
			Leaflet_Geosearch,
			leaflet.Control.Layers, //matrix layers extends this, so will appear in the same slot
			Selection,
			Mouseposition_Osgb,
			Screenposition_Osgb,
			leaflet.Control.Attribution
		];
	
		var Controls = leaflet.Class.extend({
			initialize: function(config, layers, map, manager) {
				this._controlsToHide = [];
				this._controlsToAdd = [];
				this._config = config;
				this._layers = layers;
				this._manager = manager;
				this._addDefaults();
				if (map != null) {
					this._addAllTo(map);
				}
			},
			
			_addDefaults: function() {
				//default leaflet controls
				var configOverrides = {};
				if (this._config.use_sidebar) {
					this._menuView = new MenuView(this._manager);
					this.addControl(this._menuView);
					configOverrides = {position: 'topright'};
				}
				if (this._config.show_zoom_control) {
					this.addControl(new leaflet.Control.Zoom(configOverrides));
				}
				//custom controls
				if (this._config.show_selection_control) {
					this.addControl(new Selection());
				}
				if (this._config.show_search_control) {
					this.addControl(new Leaflet_Geosearch($.extend({
						showPopup: true,
						provider: new Leaflet_Geosearch_Bing({
							key: constants.bingKey
						}),
					}, configOverrides)));
				}
				if (this._config.show_hider_control === true || (this._config.show_hider_control == 'mobile' && mobile.isMobile())) {
					this.addControl(new Leaflet_ControlHider(this._controlsToHide, {
						visibleByDefault: this._config.hider_control_start_visible
					}));
				}
				if (this._config.show_locate_control) {
					this.addControl(new Locate(configOverrides));
				}
				if (this._config.show_layers_control && this._layers != null && Object.keys(this._layers).length > 1) {
					this.addControl(new leaflet.Control.Layers(this._layers, null));
				}
				if (this._config.show_position_control) {
					//position displays
					if (mobile.isMobile()) {
						this.addControl(new Screenposition_Osgb());
					} else {
						this.addControl(new Mouseposition_Osgb());
					}
				}
			},
			
			addControl: function(control) {
				var oldControl = null;
				var found = false;
				for (var i = 0; i < order.length; i++) {
					if (control instanceof order[i]) {
						if (this._controlsToAdd[i] != null) {
							if (console) {console.debug('Overwriting existing control "' + this._controlsToAdd[i] + '" with "' + control + '".');}
							oldControl = this._controlsToAdd[i];
						}
						this._controlsToAdd[i] = control;
						if (!(control instanceof Leaflet_ControlHider)) {
							this._controlsToHide.push(control);
						}
						found = true;
						break;
					}
				}
				if (!found) {
					console.error("Unrecognised control: " + control);
					this._controlsToHide.push(control);
					this._controlsToAdd[Math.max(order.length, this._controlsToAdd.length)] = control;
				}
				//won't run for anything in addDefaults because this._map won't be populated at that point
				if (this._map != null) {
					control.addTo(this._map); //add it, could be in the wrong place, but we'll move it later if necessary
					if (oldControl != null) {
						if (control instanceof Leaflet_MatrixLayers && oldControl instanceof leaflet.Control.Layers && this._config.use_sidebar) {
							//remove standard layer control and put the new one on the menu
							oldControl.remove();
							this._menuView.addLayers(control);
						} else {
							var newContainer = control._container;
							var oldContainer = oldControl._container;
							$(newContainer).remove(); //remove from incorrect location
							$(oldContainer).replaceWith(newContainer); //reattach at new location
							oldControl.remove();
						}
					}
				}
			},
			
			_addAllTo: function(map) {
				this._controlsToAdd.forEach(function(control) {
					if (control != null) {
						control.addTo(map);
					}
				}.bind(this));
				this._map = map;
			},
			
			addAttribution: function(dataSourceName, text) {
				if (this._config.use_sidebar) {
					this._menuView.addAttribution(dataSourceName, text);
				}
			}
		});

		return Controls;
	}
);
