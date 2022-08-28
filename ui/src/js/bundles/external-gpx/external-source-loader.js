import leaflet from 'VendorWrappers/leaflet.js'

const ExternalSourceLoader = leaflet.Class.extend({
	initialize: function (manager) {
		this._manager = manager
		this._displayedSources = []
	},

	addLayers: function (sourceName, fileNameToLayers) {
		Object.values(fileNameToLayers).forEach(layer => layer.addTo(this._manager.getMap()))
		if (!this._displayedSources.includes(sourceName)) {
			this._displayedSources.push(sourceName)
			this._manager.getMatrixLayerControl().addAspect(sourceName, fileNameToLayers, {
				dimensionNames: [sourceName]
			})
		} else {
			Object.entries(fileNameToLayers).forEach(([fileName, layer]) => {
				this._manager.getMatrixLayerControl()._addMatrixOverlay(layer, fileName, sourceName)
				this._manager.getMatrixLayerControl()._update()
			})
		}
	}
})

export default ExternalSourceLoader
