import leaflet from 'leaflet'

import 'leaflet/dist/leaflet.css'

// workaround for https://github.com/Leaflet/Leaflet/issues/4968
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import retinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete leaflet.Icon.Default.prototype._getIconUrl

var prefix = window.geoBaggingBaseUrl != null ? window.geoBaggingBaseUrl : ''
leaflet.Icon.Default.mergeOptions({
	iconRetinaUrl: prefix + retinaUrl,
	iconUrl: prefix + iconUrl,
	shadowUrl: prefix + shadowUrl
})

export default leaflet
