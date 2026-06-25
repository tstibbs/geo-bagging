import {LocateControl} from 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'

var Locate = LocateControl.extend({
	options: {
		keepCurrentZoomLevel: true,
		setView: 'once'
	}
})

export default Locate
