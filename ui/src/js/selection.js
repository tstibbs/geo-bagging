import {
	BoxSelectorControl,
	BoxSelectorGpx
} from 'VendorWrappers/leaflet-box-selector'

var SelectionControl = BoxSelectorControl.extend({
	options: {
		actions: {
			gpx: {
				display: 'Export to GPX file',
				action: BoxSelectorGpx(function () {
					//just append the date in case they export multiple - prevents the browser overwriting it
					var d = new Date()
					var dateString =
						d.getFullYear() +
						'-' +
						(d.getMonth() + 1) +
						'-' +
						d.getDate() +
						'_' +
						d.getHours() +
						'-' +
						d.getMinutes() +
						'-' +
						d.getSeconds()
					return 'geoPoints_' + dateString + '.gpx'
				})
			}
		}
	}
})

export default SelectionControl
