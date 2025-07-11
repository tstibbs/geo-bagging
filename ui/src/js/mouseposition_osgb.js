import Leaflet_MousePosition from 'VendorWrappers/leaflet-mouse-position.js'
import conversion from '@tstibbs/geo-bagging-shared/conversion.js'

var MousePositionOsgb = Leaflet_MousePosition.extend({
	options: {
		formatter: function (lng, lat) {
			return conversion.latLngToGridRef(lat, lng)
		}
	}
})

export default MousePositionOsgb
