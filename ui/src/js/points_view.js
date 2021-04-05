import _ from 'underscore'
import $ from 'jquery'
import leaflet from 'leaflet'
import leaflet_cluster from 'VendorWrappers/leaflet-marker-cluster.js'
import LeafletSubgroup from 'VendorWrappers/leaflet-subgroup.js'
import markerView from './marker_view.js'

var PointsView = leaflet.Class.extend({
	initialize: function (map, config, modelsByAspect, matrixLayerControl, controls, bundles, manager) {
		this._map = map
		this._config = config
		this._modelsByAspect = modelsByAspect
		this._matrixLayerControl = matrixLayerControl
		this._controls = controls
		this._bundles = bundles
		this._parentGroup = null
		this._manager = manager
	},

	_translateMarkerGroup: function (group, bundleConfig, aspect) {
		if (group != null) {
			if (group.constructor === Array) {
				group.forEach(function (markerConfig, i, group) {
					group[i] = markerView.translateMarker(markerConfig, bundleConfig, aspect, this._manager)
				}, this)
			} else {
				//is hash
				for (var dimension in group) {
					group[dimension] = this._translateMarkerGroup(group[dimension], bundleConfig, aspect)
				}
			}
		}
		return group
	},

	finish: function (finished) {
		var deferredObject = $.Deferred()

		if (this._config.cluster) {
			var mapElem = $('div#map')
			var radius = Math.max(mapElem[0].offsetHeight, mapElem[0].offsetWidth) / 10
			this._parentGroup = new leaflet_cluster.MarkerClusterGroup({
				disableClusteringAtZoom: 15,
				maxClusterRadius: radius,
				chunkedLoading: true,
				chunkProgress: function (processed, total, elapsed, layersArray) {
					if (processed === total) {
						deferredObject.resolve()
					}
				}
			})
		} else {
			this._parentGroup = leaflet.layerGroup()
			deferredObject.resolve()
		}

		this._parentGroup.addTo(this._map)
		if (!this._config.dimensional_layering) {
			var markerLists = Object.keys(this._modelsByAspect)
				.map(
					function (aspect) {
						var model = this._modelsByAspect[aspect]
						return this._translateMarkerGroup(model.getMarkerList(), model.getBundleConfig(), aspect)
					}.bind(this)
				)
				.filter(function (value) {
					return value != null
				})
			var allMarkers = [].concat.apply([], markerLists)
			if (this._config.cluster) {
				var nullLayerId = 'null'
				var markersByLayer = allMarkers.reduce(function (markersByLayer, marker) {
					var layerId = marker.options.layerId
					layerId = layerId == null ? nullLayerId : layerId //because the Object.keys layer will coerce into a string anyway
					if (markersByLayer[layerId] == null) {
						markersByLayer[layerId] = []
					}
					markersByLayer[layerId].push(marker)
					return markersByLayer
				}, {})

				//add things that don't specify a layer to the default clustered layer
				this._parentGroup.addLayers(markersByLayer[nullLayerId])
				//add everything else to individual, non-clustered, layers
				Object.keys(markersByLayer)
					.filter(function (layerId) {
						return layerId !== nullLayerId
					})
					.forEach(
						function (layerId) {
							var markers = markersByLayer[layerId]
							var layerGroup = leaflet.layerGroup()
							for (var i = 0; i < markers.length; i++) {
								layerGroup.addLayer(markers[i])
							}
							layerGroup.addTo(this._map)
						}.bind(this)
					)
			} else {
				for (var i = 0; i < allMarkers.length; i++) {
					this._parentGroup.addLayer(allMarkers[i])
				}
			}
		} else {
			for (var aspect in this._modelsByAspect) {
				var model = this._modelsByAspect[aspect]
				this.addClusteredModel(aspect, model)
			}
		}

		return deferredObject.promise()
	},

	addClusteredModel: function (aspect, model) {
		if (model.getMarkerList() != null) {
			var markerList = this._translateMarkerGroup(model.getMarkerList(), model.getBundleConfig(), aspect)
			var matrixOverlays = {}
			this.depthFirstIteration(markerList, '', matrixOverlays)
			var aspectOptions = this._bundles[aspect] //will have other options, but collisions are unlikely
			this._matrixLayerControl.addAspect(aspect, matrixOverlays, aspectOptions)
		}
	},

	depthFirstIteration: function (markers, path, overlays) {
		if (markers.constructor === Array) {
			var subGroup = new LeafletSubgroup(this._parentGroup, markers)
			//don't add to the map yet - let the layer control do that if it thinks it needs to - otherwise we could add all layers then immediately try to remove them all, which can cause UI weirdness
			overlays[path] = subGroup
		} else {
			Object.keys(markers).forEach(
				function (dimValue) {
					var newPath = path.length === 0 ? dimValue : path + '/' + dimValue
					var sublist = markers[dimValue]
					this.depthFirstIteration(sublist, newPath, overlays)
				}.bind(this)
			)
		}
	}
})

export default PointsView
