import leaflet from 'VendorWrappers/leaflet.js'
import {gpx as toGeoJSON} from '@tmcw/togeojson'

export function calcGeoJsonBounds(geoJson) {
	var minLng
	var maxLng
	var minLat
	var maxLat
	geoJson.features.forEach(function (feature) {
		var geometry = feature.geometry
		const pointParser = point => {
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
		}
		var lineParser = function (line) {
			line.forEach(pointParser)
		}
		if (geometry.type == 'MultiLineString' || geometry.type == 'Polygon') {
			geometry.coordinates.forEach(lineParser)
		} else if (geometry.type == 'MultiPolygon') {
			geometry.coordinates.forEach(polygon => polygon.forEach(lineParser))
		} else if (geometry.type == 'Point') {
			pointParser(geometry.coordinates)
		} else if (geometry.type == 'LineString') {
			lineParser(geometry.coordinates)
		} else {
			console.log(`Unhandled geometry type: ${geometry.type}`)
			//most likely something like this, worth a go
			lineParser(geometry.coordinates)
		}
	})
	var latAdjustment = 0.005 //just to extend the bounding box a bit
	var lngAdjustment = 0.01
	var bottomLeft = [minLat - latAdjustment, minLng - lngAdjustment]
	var topRight = [maxLat + latAdjustment, maxLng + lngAdjustment]
	return leaflet.latLngBounds(bottomLeft, topRight)
}

export function rawGpxToGeoJson(gpxAsString) {
	//xml editing in nodejs is hard, so quick and dirty replace for common mistake in gpx files (url tag with value used instead of link tag with attribute)
	gpxAsString = gpxAsString.replace(/<url( [^>]+)?>(.+)<\/url>/g, `<link href="$2"></link>`)
	var dom = new DOMParser().parseFromString(gpxAsString, 'text/xml')
	var geoJson = toGeoJSON(dom)
	return geoJson
}

export function rawGeoJsonToGeoJson(geojsonAsString) {
	let parsed = JSON.parse(geojsonAsString)
	return parsed
}
