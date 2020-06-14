import Leaflet_MousePosition from 'VendorWrappers/leaflet-mouse-position'
import conversion from "./conversion";

var MousePositionOsgb = Leaflet_MousePosition.extend({
	options: {
		formatter: function (lng, lat) {
			return conversion.latLngToGridRef(lat, lng);
		}
	}
});

export default MousePositionOsgb
	