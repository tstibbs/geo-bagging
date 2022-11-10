export const ZOOM_OUT_EVENT = 'zoomOut'
export const ZOOM_IN_EVENT = 'zoomIn'

export function detectZoomDirection(map) {
	let previousZoom = map.getZoom()
	//zoomstart would be better, so we can make changes to things before zooming, but at the zoomstart point you don't know whether you're zooming in or out
	map.on('zoom', () => {
		let currentZoom = map.getZoom()
		if (Number.isInteger(currentZoom)) {
			//wait for pinch-zooms to finish so we know we've settled on the final zoom level
			//high numbers are "zoomed in", low numbers are "zoomed out"
			if (currentZoom < previousZoom) {
				console.debug(`zoom out: from=${previousZoom} to=${currentZoom}`)
				map.fire(ZOOM_OUT_EVENT)
			} else if (currentZoom > previousZoom) {
				console.debug(`zoom in: from=${previousZoom} to=${currentZoom}`)
				map.fire(ZOOM_IN_EVENT)
			} //else ignore because they're the same (perhaps we're mid-zoom)
			//store for next time
			previousZoom = map.getZoom()
		}
	})
}
