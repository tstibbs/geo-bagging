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
			})
		}
		//force new layers to be visible initially - even if layers with those names were deselected in a previous session
		Object.keys(fileNameToLayers).forEach(fileName => this._setLayerVis(sourceName, fileName, true))
		this._manager.getMatrixLayerControl()._onInputClick()
		this._manager.getMatrixLayerControl()._update()
	},

	hideLayers: function (sourceName, fileNameToLayers) {
		Object.entries(fileNameToLayers).forEach(([fileName, layer]) => {
			this._setLayerVis(sourceName, fileName, false)
			layer.remove()
		})
	},

	_setLayerVis: function (sourceName, fileName, visible) {
		this._manager.getMatrixLayerControl()._model(sourceName).inputChanged(sourceName, fileName, visible)
	}
})

export default ExternalSourceLoader
