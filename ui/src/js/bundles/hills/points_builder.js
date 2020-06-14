import AbstractPointsBuilder from '../abstract_points_builder';

var Builder = AbstractPointsBuilder.extend({
	parse: function(point) {
		//[Longitude,Latitude,Id,Name,Classification,Height(m)]
		var lng = point[0];
		var lat = point[1];
		var id = point[2];
		var name = point[3];
		var classification = point[4];
		var height = point[5];
		
		var url = 'http://www.hill-bagging.co.uk/mountaindetails.php?rf=' + id;

		var extraInfos = [
			['Height', height],
			['Classifications', this.split(classification, this._bundleConfig.hillDisplayNames)]
		];
		this.addMarker(id, lat, lng, url, name, extraInfos, null, [classification]);
	},
});

export default Builder
