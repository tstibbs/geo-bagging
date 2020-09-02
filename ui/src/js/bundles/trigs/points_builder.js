import AbstractPointsBuilder from '../abstract_points_builder'

var Builder = AbstractPointsBuilder.extend({
	parse: function (point) {
		//[Longitude,Latitude,Id,Name,physical_type,condition]
		var lng = point[0]
		var lat = point[1]
		var id = point[2]
		var name = point[3]
		var physicalType = point[4]
		var condition = point[5]
		var waypointRegex = /TP0*(\d+)/
		var url = null
		if (waypointRegex.test(id)) {
			var match = waypointRegex.exec(id)
			var trigId = match[1]
			url = 'http://trigpointing.uk/trig/' + trigId
		}
		var extraTexts = [
			['Physical Type', physicalType],
			['Condition', condition]
		]
		this.addMarker(id, lat, lng, url, name, extraTexts, physicalType, [physicalType, condition])
	},

	add: function (lngLat, url, name, extraTexts, physicalType, condition) {
		this.addMarker(null, lngLat[1], lngLat[0], url, name, extraTexts, physicalType, [physicalType, condition])
	},

	addWithoutDimensions: function (lngLat, url, name, icon) {
		this.addMarker(null, lngLat[1], lngLat[0], url, name, null, icon, [null], icon)
	}
})

export default Builder
