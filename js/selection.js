import Leaflet_boxSelector from "leaflet_boxSelector";
import leaflet_boxSelector_Gpx from "leaflet_boxSelector_Gpx";
		export default Leaflet_boxSelector.extend({
			options: {
				actions: {
					gpx: {
						display: "Export to GPX file",
						action: leaflet_boxSelector_Gpx(function() {
							//just append the date in case they export multiple - prevents the browser overwriting it
							var d = new Date();
							var dateString = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + "_" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
							return "geoPoints_" + dateString + ".gpx";
						})
					}
				}
			}
		});
	
