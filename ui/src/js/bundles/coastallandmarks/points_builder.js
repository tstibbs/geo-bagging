import AbstractPointsBuilder from '../abstract_points_builder.js'

var Builder = AbstractPointsBuilder.extend({
	//[Longitude,Latitude,Name,Link,Type,YearBuilt]
	parse: function (point) {
		var lng = point[0]
		var lat = point[1]
		var name = point[2]
		var link = point[3]
		var type = point[4]
		var opened = point[5]

		var extraInfos = [
			['Type', type],
			['Built/Opened', opened]
		]
		this.addMarker(name, lat, lng, link, name, extraInfos, null, [type])
	}
})

export default Builder
