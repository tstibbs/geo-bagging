import Leaflet_MousePosition from 'VendorWrappers/leaflet-mouse-position'
import conversion from "./conversion";
		export default Leaflet_MousePosition.extend({
			options: {
				formatter: function (lng, lat) {
					return conversion.latLngToGridRef(lat, lng);
				}
			}
		});
	
