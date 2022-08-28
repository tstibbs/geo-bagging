import leaflet from 'VendorWrappers/leaflet.js'
import {gpx as toGeoJSON} from '@tmcw/togeojson'

export function calcGeoJsonBounds(geoJson) {
	var minLng
	var maxLng
	var minLat
	var maxLat
	geoJson.features.forEach(function (feature) {
		var geometry = feature.geometry
		var lineParser = function (line) {
			line.forEach(function (point) {
				var lng = point[0]
				var lat = point[1]
				if (minLng == null || lng < minLng) {
					minLng = lng
				}
				if (maxLng == null || lng > maxLng) {
					maxLng = lng
				}
				if (minLat == null || lat < minLat) {
					minLat = lat
				}
				if (maxLat == null || lat > maxLat) {
					maxLat = lat
				}
			})
		}
		if (geometry.type == 'MultiLineString') {
			geometry.coordinates.forEach(lineParser)
		} else {
			lineParser(geometry.coordinates)
		}
	})
	var latAdjustment = 0.005 //just to extend the bounding box a bit
	var lngAdjustment = 0.01
	var bottomLeft = [minLat - latAdjustment, minLng - lngAdjustment]
	var topRight = [maxLat + latAdjustment, maxLng + lngAdjustment]
	return leaflet.latLngBounds(bottomLeft, topRight)
}

export function gpxToGeoJson(gpxAsString) {
	var dom = new DOMParser().parseFromString(gpxAsString, 'text/xml')
	var geoJson = toGeoJSON(dom)
	return geoJson
}
