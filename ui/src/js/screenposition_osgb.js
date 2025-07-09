import Leaflet_ScreenPosition from 'VendorWrappers/leaflet-map-center-coord.js'
import conversion from '@tstibbs/geo-bagging-shared/conversion.js'
import $ from 'jquery'

var ScreenPositionOsgb = Leaflet_ScreenPosition.extend({
	options: {
		onMove: true,
		icon: true,
		latLngFormatter: function (lat, lng) {
			return conversion.latLngToGridRef(lat, lng)
		}
	},

	addTo: function (map) {
		Leaflet_ScreenPosition.prototype.addTo.call(this, map)
		this._addShowHideHandling()
	},

	_addShowHideHandling: function () {
		var $icon = $('div.leaflet-control-mapcentercoord-icon.leaflet-zoom-hide')
		var isIconVisible = false
		var $control = $('div.leaflet-control-mapcentercoord.leaflet-control')

		function hideIcon() {
			$icon.css('visibility', 'hidden')
			isIconVisible = false
		}

		function showIcon() {
			$icon.css('visibility', 'visible')
			isIconVisible = true
		}

		$control.click(function () {
			if (isIconVisible) {
				hideIcon()
			} else {
				showIcon()
			}
		})
		//start with crosshairs hidden
		hideIcon()
	}
})

export default ScreenPositionOsgb
