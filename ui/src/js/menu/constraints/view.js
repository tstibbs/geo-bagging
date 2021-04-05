import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet.js'
import FileConstraintsLoadView from './track_load_view.js'
import CurrentLocationView from './current_location_view.js'
import CurrentAreaView from './current_area_view.js'

var ConstraintsView = leaflet.Class.extend({
	initialize: function (manager) {
		this._manager = manager
		this._limitOriginView = null //the view that triggered the current limits
		this._view = $('<div></div>')
		var info = $(
			'<div class="info">This section allows you to limit how much data is displayed on screen. This can be useful for example when on older or mobile devices which may struggle to remain responsive if a large amount of data is loaded.</div>'
		)
		this._view.append(info)
		this._view.append('<hr class="info">')

		var currentAreaView = new CurrentAreaView(manager, this)
		this._view.append(currentAreaView.getView())

		var currentLocationView = new CurrentLocationView(manager, this)
		this._view.append(currentLocationView.getView())

		this._fileConstraintsLoadView = new FileConstraintsLoadView(manager, this)
		this._view.append(this._fileConstraintsLoadView.getView())

		var reset = this._buildReset()
		this._view.append(reset)
	},

	_buildReset: function () {
		var wrapper = $('<div class="setting"></div>')
		var currentLocationLimitButton = $('<button type="button">Reset</button>')
		currentLocationLimitButton.click(this.unlimit.bind(this))
		wrapper.append(currentLocationLimitButton)
		return wrapper
	},

	limitTo: function (limitOriginView, /*LatLngBounds*/ bounds) {
		this.unlimit()
		this._limitOriginView = limitOriginView
		this._manager.setViewConstraints(this._buildLimitFunction(bounds))
		if (this._constraintPolygon != null) {
			this._constraintPolygon.remove()
		}
		var polygonPoints = [
			[
				[-90, -180],
				[90, -180],
				[90, 180],
				[-90, 180]
			] //outer - should cover the entire map
		]
		if (!Array.isArray(bounds)) {
			bounds = [bounds]
		}
		bounds.forEach(function (hole) {
			polygonPoints.push([hole.getSouthWest(), hole.getNorthWest(), hole.getNorthEast(), hole.getSouthEast()]) //hole
		})
		this._constraintPolygon = new L.Polygon(polygonPoints, {
			color: 'rgb(0, 0, 0, 0)',
			fillColor: 'rgb(90, 90, 90)',
			fillOpacity: 0.3
		})
		this._constraintPolygon.addTo(this._manager.getMap())
	},

	_buildLimitFunction: function (bounds) {
		if (Array.isArray(bounds)) {
			return function (latLng) {
				for (var i = 0; i < bounds.length; i++) {
					if (bounds[i].contains(latLng)) {
						return true
					}
				}
				return false
			}
		} else {
			return function (latLng) {
				return bounds.contains(latLng)
			}
		}
	},

	unlimit: function () {
		if (this._limitOriginView != null) {
			this._limitOriginView.reset()
			this._limitOriginView = null
		}
		this._manager.setViewConstraints(null)
		if (this._constraintPolygon != null) {
			this._constraintPolygon.remove()
		}
	},

	getView: function () {
		return this._view
	}
})

export default ConstraintsView
