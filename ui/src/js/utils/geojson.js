import leaflet from 'VendorWrappers/leaflet.js'
import {gpx as toGeoJSON} from '@tmcw/togeojson'
import {polygon} from '@turf/turf'

export function calcGeoJsonBounds(geoJson) {
	if (geoJson.type !== 'FeatureCollection') {
		console.log(`incompatible geoJson.type=${geoJson.type}, attempting to parse anyway...`)
	}
	//margin for the bounding box:
	const latAdjustment = 0.005
	const lngAdjustment = 0.01
	let polygons = geoJson.features.map(function (feature) {
		var minLng = null
		var maxLng = null
		var minLat = null
		var maxLat = null
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
		} else if (geometry.type == 'LineString' || geometry.type == 'MultiPoint') {
			lineParser(geometry.coordinates)
		} else {
			console.log(`Unhandled geometry type: ${geometry.type}`)
			//most likely something like this, worth a go
			lineParser(geometry.coordinates)
		}
		let top = maxLat + latAdjustment
		let bottom = minLat - latAdjustment
		let left = minLng - lngAdjustment
		let right = maxLng + lngAdjustment
		let polygonCoords = [
			[left, top],
			[right, top],
			[right, bottom],
			[left, bottom],
			[left, top]
		]
		return polygon([polygonCoords])
	})
	return polygons
}

export function rawGpxToGeoJson(gpxAsString) {
	//xml editing in nodejs is hard, so quick and dirty replace for common mistake in gpx files (url tag with value used instead of link tag with attribute)
	gpxAsString = gpxAsString.replace(/<url( [^>]+)?>(.+)<\/url>/g, `<link href="$2"></link>`)
	var dom = new DOMParser().parseFromString(gpxAsString, 'text/xml')
	var geoJson = toGeoJSON(dom)
	let multiBounds = calcGeoJsonBounds(geoJson)
	return {
		features: geoJson,
		bounds: multiBounds
	}
}

export function rawGeoJsonToGeoJson(geojsonAsString) {
	let parsed = JSON.parse(geojsonAsString)
	let multiBounds = calcGeoJsonBounds(parsed)
	return {
		features: parsed,
		bounds: multiBounds
	}
}

export function geoJsonCoordsToLeaflet(geojsonCoords) {
	return leaflet.GeoJSON.coordsToLatLngs(geojsonCoords)
}

export function geoJsonBoundsToLeaflet(bounds) {
	return bounds.map(polygon => {
		const coordinates = geoJsonCoordsToLeaflet(polygon.geometry.coordinates[0])
		const bound = new leaflet.LatLngBounds()
		for (const coord of coordinates) {
			bound.extend(coord)
		}
		return bound
	})
}
