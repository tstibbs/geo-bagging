import AbstractPointsBuilder from '../abstract_points_builder.js'

var Builder = AbstractPointsBuilder.extend({
	parse: function (point) {
		//[Longitude,Latitude,Id,Name,Link,type,facilities]
		var lng = point[0]
		var lat = point[1]
		var id = point[2]
		var name = point[3]
		var link = point[4]
		var types = point[5]
		var facilities = point[6]

		var typeLabels = this._bundleConfig.dimensionValueLabels[this._bundleConfig.dimensionNames[0]]
		var facilityLabels = this._bundleConfig.dimensionValueLabels[this._bundleConfig.dimensionNames[1]]

		var extraInfos = [
			['Type', this.split(types, typeLabels)],
			['Facilities', this.split(facilities, facilityLabels)]
		]

		this.addMarker(id, lat, lng, link, name, extraInfos, null, [types, facilities])
	}
})

export default Builder
