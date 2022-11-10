import leaflet from 'VendorWrappers/leaflet.js'
import popupView from '../popup_view.js'

const selectedOutlineWidth = 3

var GeoJsonTranslator = leaflet.Class.extend({
	initialize: function (manager, colour, initialOutlineWidth) {
		this._manager = manager
		this._colour = colour
		this._initialOutlineWidth = initialOutlineWidth
	},

	_showAsSelected: function (layer) {
		// check first if we _can_ style, as some layers can be things like Marker objects which
		// don't have a setStyle function - this feels hacky but that's what they do in leaflet
		// (see https://github.com/Leaflet/Leaflet/blob/5e9e3c74902af8fbd834e483870c838a9d436e49/src/layer/GeoJSON.js#L156)
		if (layer.setStyle) {
			layer.setStyle({
				weight: selectedOutlineWidth
			})
		}
	},

	_extractName: function (feature, extraInfos, fileName) {
		const findAndExtract = (regex, fallback) => {
			let index = extraInfos.findIndex(([key, value]) => regex.test(key))
			if (index != -1) {
				let value = extraInfos[index][1]
				if (value != null && `${value}`.length > 0) {
					if (fallback) {
						//if it's a fallback property then prefix with the file name, otherwise it's unlikely it will make much sense
						value = `${fileName} / ${value}`
					} else {
						//if the property was something like 'name' then remove the element so it isn't shown in the infos section
						extraInfos.splice(index, 1)
					}
					return value //stop looking
				}
			}
		}
		let name = null
		// properties that could be used for the name, in order of preference
		const nameProperties = [/name/, /Name/, /name/i]
		const fallBackProperties = [/ID/i, /OBJECTID/i, /GLOBALID/i]
		for (let nameRegex of nameProperties) {
			name = findAndExtract(nameRegex, false)
			if (name != null) {
				break
			}
		}
		if (name == null) {
			for (let nameRegex of fallBackProperties) {
				name = findAndExtract(nameRegex, true)
				if (name != null) {
					break
				}
			}
		}
		//fallback if nothing suitable found
		if (name == null) {
			name = fileName
		}
		if (feature.properties == null) {
			feature.properties = {}
		}
		feature.properties.name = name
	},

	_buildExtraInfos: function (featureProperties) {
		//filter out blanks
		let infos = []
		if (featureProperties != null) {
			infos = Object.entries(featureProperties).filter(([key, value]) => value != null && `${value}`.length > 0)
		}
		//now get the props into shape for displaying
		const gpxPropsToIgnore = ['sym', '_gpxType', 'coordTimes']
		const gpxPrefixesToIgnore = ['SHAPE_']
		const filterPropName = propName => {
			return !gpxPropsToIgnore.includes(propName) && !gpxPrefixesToIgnore.some(prefix => propName.startsWith(prefix))
		}
		//filter out some gpx properties we know we don't want
		infos = infos
			.filter(([key, value]) => filterPropName(key))
			//translate links from gpx into our format
			.map(([key, value]) => {
				if (Array.isArray(value)) {
					value = value.map(entry => {
						let linkValues = Object.entries(entry)
						if (linkValues.length == 1 && linkValues[0][0] == 'href') {
							let url = linkValues[0][1]
							return [url, url]
						} else {
							return JSON.stringify(entry) //fallback, who knows what the structure is like, not much we can do
						}
					})
				}
				return [key, value]
			})
		return infos
	},

	dataToLayers: function (layerDatas) {
		//add the new layers
		let newLayers = Object.fromEntries(
			layerDatas.map(layerData => {
				const {name, url, geojson, extraInfos} = layerData
				const nameToFeatures = {}
				const onFeatureClick = e => {
					let layer = e.target
					this._showAsSelected(layer)
					let featureName = layer.feature.properties.name
					if (featureName) {
						let layers = nameToFeatures[featureName]
						if (layer != null) {
							layers.forEach(this._showAsSelected)
						}
					}
				}
				let geoJsonLayer = leaflet.geoJSON(geojson, {
					weight: this._initialOutlineWidth, //stroke width in pixels - aka border width
					color: this._colour,
					onEachFeature: (feature, layer) => {
						let featureExtraInfos = extraInfos != undefined ? extraInfos : this._buildExtraInfos(feature.properties)
						this._extractName(feature, featureExtraInfos, name)
						let featureName = feature.properties.name
						var visited = null //not supported on geojson sources for now
						var popup = popupView.buildPopup(this._manager, featureName, url, null, featureExtraInfos, visited)
						layer.bindPopup(popup)
						if (!(featureName in nameToFeatures)) {
							nameToFeatures[featureName] = []
						}
						nameToFeatures[featureName].push(layer)
						layer.on({
							click: onFeatureClick
						})
					}
				})
				//reset all styles when the map is clicked anywhere. Style will be re-added if it is one of these features that is clicked (same way the popups work)
				this._manager.getMap().on({
					preclick: () => {
						geoJsonLayer.resetStyle()
					}
				})
				return [name, geoJsonLayer]
			})
		)
		return newLayers
	}
})

export default GeoJsonTranslator
