define(["leaflet", "leaflet_controlHider", "selection", "locate", "mobile", "leaflet_geosearch", "leaflet_geosearch_bing", "mouseposition_osgb", "screenposition_osgb", "constants"],
	function(leaflet, Leaflet_ControlHider, Selection, Locate, mobile, Leaflet_Geosearch, Leaflet_Geosearch_Bing, Mouseposition_Osgb, Screenposition_Osgb, constants) {

		//even if some items aren't used in this particular configuration, we'll stick to a given order (resulting gaps are fine)
		var order = [
			Leaflet_ControlHider,
			leaflet.Control.Zoom,
			Locate,
			Leaflet_Geosearch,
			leaflet.Control.Layers, //matrix layers extends this, so will appear in the same slot
			Selection,
			Mouseposition_Osgb,
			Screenposition_Osgb
		];
	
		var Controls = leaflet.Class.extend({
			initialize: function(config, layers) {
				this._controlsToHide = [];
				this._controlsToAdd = [];
				this._config = config;
				this._layers = layers;
				this._addDefaults();
			},
			
			_addDefaults: function() {
				this.addControl(new leaflet.Control.Zoom(), true);
				if (this._config.show_selection_control) {
					this.addControl(new Selection());
				}
				if (this._config.show_search_control) {
					this.addControl(new Leaflet_Geosearch({
						showPopup: true,
						provider: new Leaflet_Geosearch_Bing({
							key: constants.bingKey
						})
					}));
				}
				if (this._config.show_hider_control == true || (this._config.show_hider_control == 'mobile' && mobile.isMobile())) {
					this.addControl(new Leaflet_ControlHider(this._controlsToHide, {
						visibleByDefault: this._config.hider_control_start_visible
					}));
				}
				if (this._config.show_locate_control) {
					this.addControl(new Locate());
				}
				if (this._config.show_layers_control && !this._config.dimensional_layering && this._layers != null && Object.keys(this._layers).length > 1) {
					this.addControl(new leaflet.Control.Layers(this._layers, null));
				}
				//position displays
				if (mobile.isMobile()) {
					this.addControl(new Screenposition_Osgb());
				} else {
					this.addControl(new Mouseposition_Osgb());
				}
			},
			
			addControl: function(control) {
				var found = false;
				for (var i = 0; i < order.length; i++) {
					if (control instanceof order[i]) {
						if (this._controlsToAdd[i] != null) {
							console.error('Overwriting existing control "' + this._controlsToAdd[i] + '" with "' + control + '".');
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
			},
			
			addAllTo: function(map) {
				this._controlsToAdd.forEach(function(control) {
					if (control != null) {
						control.addTo(map);
					}
				}.bind(this));
			}
		});

		return Controls;
	}
);
