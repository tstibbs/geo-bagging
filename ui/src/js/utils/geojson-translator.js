import 'proj4'
import 'proj4leaflet'
import leaflet from 'VendorWrappers/leaflet.js'
import popupView from '../popup_view.js'
import {buildMarkerClusterGroup} from './marker-cluster.js'

const selectedOutlineWidth = 3

var GeoJsonTranslator = leaflet.Class.extend({
	initialize: function (manager, unselectedStyle) {
		this._manager = manager
		this._unselectedStyle = unselectedStyle
		if (unselectedStyle.initialOutlineWidth != null) {
			//stroke width in pixels - aka border width
			this._unselectedStyle.weight = unselectedStyle.initialOutlineWidth
		}
	},

	_showAsSelected: function (layer) {
		// check first if we _can_ style, as some layers can be things like Marker objects which
		// don't have a setStyle function - this feels hacky but that's what they do in leaflet
		// (see https://github.com/Leaflet/Leaflet/blob/5e9e3c74902af8fbd834e483870c838a9d436e49/src/layer/GeoJSON.js#L156)
		if (layer.setStyle) {
			layer.setStyle({
				weight: selectedOutlineWidth,
				fillOpacity: 0.2
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
		const gpxPropsToIgnore = ['sym', '_gpxType', 'coordTimes', 'coordinateProperties']
		const gpxPrefixesToIgnore = ['SHAPE_']
		const filterPropName = propName => {
			return !gpxPropsToIgnore.includes(propName) && !gpxPrefixesToIgnore.some(prefix => propName.startsWith(prefix))
		}
		//filter out some gpx properties we know we don't want
		infos = infos
			.filter(([key, value]) => filterPropName(key))
			//translate links from gpx into our format
			.map(([key, value]) => {
				if (key == 'links') {
					value = value.map(link => {
						let {href, type, text} = link
						if (text == null || text.trim().length == 0) {
							text = href
						}
						return {
							url: href,
							text,
							type
						}
					})
				} else if (Array.isArray(value)) {
					value = value.map(entry => {
						return JSON.stringify(entry) //who knows what the structure is like, not much we can do
					})
				}
				return [key, value]
			})
		return infos
	},

	_createGeoJsonLayer: function (geojson, style) {
		// the idea of a geojson being able to specify a CRS existed in old geojson specs, but has been removed in newer specs (see https://datatracker.ietf.org/doc/html/rfc7946#section-4)
		// we use proj4leaflet's geojson layer which looks at the CRS (if one is specified) because some datasets do specify a CRS, so this might help.
		// however, annoyingly proj4 doesn't know how to handle the standard geojson CRS, so if it's specified then the load file fail. Thus if the specified CRS is just the standard geojson CRS anyway, we remove it to prevent proj4 having to deal with it.
		if (/urn:ogc:def:crs:OGC:[^:]*:CRS84/.test(geojson?.crs?.properties?.name)) {
			delete geojson.crs
		}
		return leaflet.Proj.geoJson(geojson, style)
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
				let geoJsonLayer = this._createGeoJsonLayer(geojson, {
					style: this._unselectedStyle,
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

				//add clustering layer to cluster any 'point' objects in the geojson
				let clusterGroup = buildMarkerClusterGroup(this._manager.getMap())
				clusterGroup.addLayers(geoJsonLayer)
				//reset all styles when the map is clicked anywhere. Style will be re-added if it is one of these features that is clicked (same way the popups work)
				this._manager.getMap().on({
					preclick: () => {
						geoJsonLayer.resetStyle()
					}
				})
				return [name, clusterGroup]
			})
		)
		return newLayers
	}
})

export default GeoJsonTranslator
