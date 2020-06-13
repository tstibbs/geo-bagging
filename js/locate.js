import leaflet_locate from "leaflet.locatecontrol";
		export default leaflet_locate.extend({
			options: {
				keepCurrentZoomLevel: true,
				setView: 'once'
			}
		});
	
