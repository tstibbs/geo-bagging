import leaflet from 'VendorWrappers/leaflet.js'
import {GeoSearchControl, BingProvider} from 'leaflet-geosearch'

//leaflet-geosearch creates a new class every time you create a control. This makes it difficult to do instanceof checks, so we create a dummy control and extract the 'real' prototype, and then create our own wrapper class for subsequent use
const dummyControl = new GeoSearchControl({
	provider: function dummy() {}
})

function GeoSearchControlWrapper(/*arguments*/) {
	if (this.initialize) {
		this.initialize.apply(this, arguments)
	}
}

var parentProto = Object.getPrototypeOf(dummyControl)
GeoSearchControlWrapper.__super__ = parentProto
GeoSearchControlWrapper.prototype = leaflet.Util.create(parentProto)
GeoSearchControlWrapper.prototype.constructor = GeoSearchControlWrapper

export const GeosearchControl = GeoSearchControlWrapper
export const GeosearchBing = BingProvider
