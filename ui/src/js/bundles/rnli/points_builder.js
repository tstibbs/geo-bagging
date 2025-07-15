import AbstractPointsBuilder from '../abstract_points_builder.js'

var Builder = AbstractPointsBuilder.extend({
	parse: function (point) {
		//[Longitude,Latitude,Name,Link,LifeboatTypes,LaunchMethods]
		var lng = point[0]
		var lat = point[1]
		var name = point[3]
		var link = point[4]
		var types = point[5]
		var launchMethods = point[6]

		var typeLabels = this._bundleConfig.typeData
		var launchMethodLabels = this._bundleConfig.dimensionValueLabels[this._bundleConfig.dimensionNames[1]]

		var extraInfos = [
			['Types', this.split(types, typeLabels)],
			['Launch Methods', this.split(launchMethods, launchMethodLabels)]
		]
		this.addMarker(name, lat, lng, link, name, extraInfos, null, [types, launchMethods])
	}
})

export default Builder
