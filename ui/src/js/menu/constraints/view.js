import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet.js'
import TrackConstraintsLoadView from './track_load_view.js'
import CurrentLocationView from './current_location_view.js'
import CurrentAreaView from './current_area_view.js'
import {GeoJsonConstraintLoadView} from './geo-json-load-view.js'
import {geoJsonCoordsToLeaflet, geoJsonBoundsToLeaflet} from '../../utils/geojson.js'
import {mergePolygons} from '../../utils/polygon-merger.js'
import {polygon} from '@turf/turf'

var ConstraintsView = leaflet.Class.extend({
	initialize: function (manager) {
		this._manager = manager
		this._constraintPolygons = []
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

		this._trackConstraintsLoadView = new TrackConstraintsLoadView(manager, this)
		this._view.append(this._trackConstraintsLoadView.getView())

		this._geoJsonConstraintLoadView = new GeoJsonConstraintLoadView(manager, this)
		this._view.append(this._geoJsonConstraintLoadView.getView())

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

	limitToBounds: function (limitOriginView, /*LatLngBounds*/ bounds) {
		//translating to geojson just to translate back is somewhat inefficient, but as it's only a single polygon it shouldn't cause a noticeable slowdown. It's simpler to do this than to have two versions of the main limitTo function
		let polygonPoints = [
			bounds.getSouthWest(),
			bounds.getNorthWest(),
			bounds.getNorthEast(),
			bounds.getSouthEast(),
			bounds.getSouthWest()
		].map(latLng => leaflet.GeoJSON.latLngToCoords(latLng))
		let boundsAsGeoJson = polygon([polygonPoints])
		this.limitToGeoJsonPolygons(limitOriginView, [boundsAsGeoJson])
	},

	limitToGeoJsonPolygons: function (limitOriginView, /*[GeoJson Polygon]*/ bounds) {
		this.unlimit()
		this._limitOriginView = limitOriginView
		if (!Array.isArray(bounds)) {
			bounds = [bounds]
		}
		this._manager.setViewConstraints(this._buildLimitFunction(bounds))
		var polygonPoints = [
			[
				[-90, -180],
				[90, -180],
				[90, 180],
				[-90, 180]
			] //outer - should cover the entire map
		]
		let geoJsonBounds = mergePolygons(bounds)
		geoJsonBounds.forEach(hole => {
			let coords = hole.geometry.coordinates
			//take polygon bounds (the first element in the array) to make a hole in the main polygon
			let holePoints = geoJsonCoordsToLeaflet(coords[0])
			polygonPoints.push(holePoints)
			//take polygon holes (the remaining elements in the array) to re-add a constraint polygon for any holes-within-holes
			let holesInHoles = coords.slice(1)
			holesInHoles.forEach(holeInHole => {
				let holeInHolePolygon = geoJsonCoordsToLeaflet(holeInHole)
				this._addMaskPolygon(holeInHolePolygon)
			})
		})
		this._addMaskPolygon(polygonPoints)
	},

	_addMaskPolygon: function (polygonPoints) {
		let polygon = new L.Polygon(polygonPoints, {
			color: 'rgb(0, 0, 0, 0)',
			fillColor: 'rgb(90, 90, 90)',
			fillOpacity: 0.3
		})
		polygon.addTo(this._manager.getMap())
		this._constraintPolygons.push(polygon)
	},

	_buildLimitFunction: function (geoJsonPolygons) {
		let bounds = geoJsonBoundsToLeaflet(geoJsonPolygons)
		return function (latLng) {
			for (var i = 0; i < bounds.length; i++) {
				if (bounds[i].contains(latLng)) {
					return true
				}
			}
			return false
		}
	},

	unlimit: function () {
		if (this._limitOriginView != null) {
			this._limitOriginView.reset()
			this._limitOriginView = null
		}
		this._manager.resetViewConstraints()
		if (this._constraintPolygons != null) {
			this._constraintPolygons.forEach(polygon => polygon.remove())
			this._constraintPolygons = []
		}
	},

	getView: function () {
		return this._view
	}
})

export default ConstraintsView
