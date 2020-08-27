import leaflet_locate from "leaflet.locatecontrol";
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'

var Locate = leaflet_locate.extend({
	options: {
		keepCurrentZoomLevel: true,
		setView: 'once'
	}
});

export default Locate
