import Leaflet_MousePosition from "leaflet_mouseposition";
import conversion from "./conversion";
		export default Leaflet_MousePosition.extend({
			options: {
				latLngFormatter: function (lat, lng) {
					return conversion.latLngToGridRef(lat, lng);
				}
			}
		});
	
