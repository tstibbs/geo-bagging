import leaflet_locate from "leaflet.locatecontrol";

var Locate = leaflet_locate.extend({
	options: {
		keepCurrentZoomLevel: true,
		setView: 'once'
	}
});

export default Locate
