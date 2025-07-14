import leaflet from 'VendorWrappers/leaflet.js'
import $ from 'jquery'
import fullscreen_link from './fullscreen_link.js'
import mobile from './mobile.js'
import {detectZoomDirection} from './leaflet-plugins/zoom-detector.js'
import {maxOverallZoom, minOverallZoom} from './layers.js'

const DEFAULT_CRS = leaflet.CRS.EPSG3857

var MapView = leaflet.Class.extend({
	initialize: function (config) {
		this._config = config
		this._initLat = this._config.start_position[0]
		this._initLng = this._config.start_position[1]
		this._initZoom = this._config.initial_zoom
		this._createView()
		// set up the map
		this._map = new leaflet.Map(this._config.map_element_id, {
			//these controls will be added by the controls module
			zoomControl: false,
			//set up the min and max zoom first to prevent the min/max changing when layers are loading, as this could change the zoom we set below in setView.
			minZoom: minOverallZoom,
			maxZoom: maxOverallZoom,
			crs: DEFAULT_CRS
		})

		//set start point
		this._map.setView(
			new leaflet.LatLng(this._config.start_position[0], this._config.start_position[1]),
			this._config.initial_zoom
		)
		fullscreen_link(this._config, this._map)

		//hook up listener to save the location when we move it
		this._map.on(
			'zoomend moveend dragend',
			function () {
				this._saveLocation()
			},
			this
		)
		this._map.on('baselayerchange', ({layer}) => {
			let originalBounds = this._map.getBounds()
			let oldCrs = this._map.options?.crs
			let newCrs = layer.options?.crs != null ? layer.options.crs : DEFAULT_CRS
			console.debug(`Switching CRS from ${oldCrs.code} to ${newCrs.code}`)
			if (oldCrs !== newCrs) {
				this._map.options.crs = newCrs
				this._map.options.zoomSnap = 0
				this._map.fitBounds(originalBounds)
				this._map.fitBounds(originalBounds)

				//manually round zoom because fitbounds just floors it which leads to stepping when switching layers back and forwards
				this._map.setZoom(Math.round(this._map.getZoom()))
				this._map.options.zoomSnap = 1
			}
		})

		//hook up zoom in/out detector
		detectZoomDirection(this._map)
	},

	postInit: function () {
		console.debug(`force setting init position: ${this._initLat}, ${this._initLng}, ${this._initZoom}`)
		//start position might have got messed up during CRS changes, so we re-set it here
		this._map.setView(new leaflet.LatLng(this._initLat, this._initLng), this._initZoom)
	},

	//creates the html we need to display errors, loading screen and the map container
	_createView: function () {
		var content = ''

		var mapClass = ''
		if (this._config.map_style == 'mini' || this._config.map_style == 'mini_embedded') {
			mapClass = ' class="mini-map"'
		} else if (this._config.map_style == 'full') {
			mapClass = ' class="full-screen"'
		} else if (this._config.map_style == 'embedded') {
			mapClass = ' class="embedded-map"'
		}

		if (this._config.map_style == 'mini' || this._config.map_style == 'mini_embedded') {
			content += '<div class="mini-map">'
		}
		content += '<div id="' + this._config.map_element_id + '"' + mapClass + '></div>'
		if (this._config.map_style == 'mini') {
			content += '</div>'
			content += '<div class="full-screen-link"></div>'
		}

		if (this._config.map_style == 'full') {
			this._config.map_outer_container_element.addClass('full-screen')
		}
		if (mobile.isMobile()) {
			this._config.map_outer_container_element.addClass('mobile')
		}
		this._config.map_outer_container_element.prepend($(content))
	},

	_saveLocation: function () {
		var center = this._map.getCenter()
		var start_position = [center.lat, center.lng]
		var initial_zoom = this._map.getZoom()
		if (localStorage !== undefined) {
			var hash = {
				start_position: start_position,
				initial_zoom: initial_zoom
			}
			this._config.persist(hash)
			console.debug(JSON.stringify(hash))
		}
	},

	getMap: function () {
		return this._map
	}
})

export default MapView
