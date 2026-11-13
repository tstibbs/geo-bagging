import leaflet from 'VendorWrappers/leaflet.js'
import $ from 'jquery'
import Leaflet_ControlHider from 'VendorWrappers/leaflet-control-hider.js'
import Selection from './selection.js'
import Locate from './locate.js'
import mobile from './mobile.js'
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch'
import Mouseposition_Osgb from './mouseposition_osgb.js'
import Screenposition_Osgb from './screenposition_osgb.js'
import constants from './constants.js'
import MenuView from './menu/view.js'
import Leaflet_MatrixLayers from 'VendorWrappers/leaflet-matrix-layers-control.js'

var Controls = leaflet.Class.extend({
	initialize: function (config, layers, map, manager) {
		this._controlsToHide = []
		this._controlsToAdd = []
		this._config = config
		this._layers = layers
		this._manager = manager
		this._addDefaults()
		if (map != null) {
			this._addAllTo(map)
		}
	},

	_addDefaults: function () {
		var configOverrides = {}
		if (this._config.use_sidebar) {
			configOverrides = {position: 'topright'}
		}

		if (
			this._config.show_hider_control === true ||
			(this._config.show_hider_control == 'mobile' && mobile.isMobile())
		) {
			this.addControl(
				new Leaflet_ControlHider(this._controlsToHide, {
					visibleByDefault: this._config.hider_control_start_visible
				})
			)
		}
		if (this._config.use_sidebar) {
			this._menuView = new MenuView(this._manager)
			this.addControl(this._menuView)
		}
		if (this._config.show_zoom_control) {
			this.addControl(new leaflet.Control.Zoom(configOverrides))
		}
		if (this._config.show_locate_control) {
			this.addControl(new Locate(configOverrides))
		}
		if (this._config.show_search_control) {
			this.addControl(
				new GeoSearchControl(
					$.extend(
						{
							showPopup: true,
							provider: new OpenStreetMapProvider()
						},
						configOverrides
					)
				)
			)
		}
		if (!this._config.dimensional_layering && this._layers != null && Object.keys(this._layers).length > 1) {
			const control = new leaflet.Control.Layers(this._layers, null)
			if (this._config.use_sidebar) {
				this._menuView.addLayers(control)
			} else {
				this.addControl(control)
			}
		}
		if (this._config.show_selection_control) {
			this.addControl(new Selection())
		}
		if (this._config.show_position_control) {
			//position displays
			if (mobile.isMobile()) {
				this.addControl(new Screenposition_Osgb())
			} else {
				this.addControl(new Mouseposition_Osgb())
			}
		}
	},

	addControl: function (control) {
		if (this._map != null) {
			control.addTo(this._map)
		} else {
			this._controlsToAdd.push(control)
		}
		if (control instanceof Leaflet_MatrixLayers) {
			this._menuView.addLayers(control)
		}
		if (!(control instanceof Leaflet_ControlHider)) {
			this._controlsToHide.push(control)
		}
	},

	_addAllTo: function (map) {
		this._controlsToAdd.forEach(
			function (control) {
				if (control != null) {
					control.addTo(map)
				}
			}.bind(this)
		)
		this._map = map
	},

	addAttribution: function (dataSourceName, text) {
		if (this._config.use_sidebar) {
			this._menuView.addAttribution(dataSourceName, text)
		}
	}
})

export default Controls
