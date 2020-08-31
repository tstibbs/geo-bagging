import Squire from 'Squire'
import sinon from 'sinon'
import Config from '../src/js/config'

let assert = eval('chai.assert')

describe('osMap', function () {
	hooks.beforeEach(function () {
		if (localStorage !== undefined) {
			localStorage.clear()
		}
	})
	it('map centre', function () {
		var lat = 51.3
		var lng = -1.2
		var options = {
			start_position: [lat, lng]
		}
		runTest(assert, false, options, function (leafletMap) {
			var actualCentre = leafletMap.getCenter()
			var actualLat = actualCentre.lat
			var actualLng = actualCentre.lng
			assert.equal(actualLat, lat)
			assert.equal(actualLng, lng)
		})
	})

	it('zoom level', function () {
		var zoomLevel = 12
		var options = {
			initial_zoom: zoomLevel
		}
		runTest(assert, false, options, function (leafletMap) {
			var actualZoom = leafletMap.getZoom()
			assert.equal(actualZoom, zoomLevel)
		})
	})

	describe('persistance', function () {
		it('zoom level', function () {
			var options = {
				initial_zoom: 12
			}
			runTest(assert, false, options, function (leafletMap) {
				//leaflet appears to fire events in add order, so we add an event and wait for it to fire to check that our change has been persisted
				var done = assert.async()
				leafletMap.on(
					'zoomend',
					function () {
						var newConfig = new Config()
						assert.equal(newConfig.initial_zoom, 16)
						done()
					},
					this
				)
				//run test
				leafletMap.zoomIn(4)
			})
		})
		it('map centre', function () {
			var startLatLng = [51.3, -1.2]
			var newLatLng = [53.67, 1.877]
			var options = {
				start_position: startLatLng
			}
			runTest(assert, false, options, function (leafletMap, layers) {
				leafletMap.panTo(newLatLng)
				var newConfig = new Config()
				assert.deepEqual(newConfig.start_position, newLatLng)
			})
		})
	})
})

function runTest(assert, isMobile, options, verify) {
	var done = assert.async()

	var testDiv = $('<div></div>')
	testDiv.append('<div id="map" style="height: 180px;"></div>')
	$('#test-fixture').append(testDiv)

	var injector = new Squire()
	var layersMock = {}
	injector.mock(
		'layers',
		sinon.spy(function () {
			return layersMock
		})
	)
	injector.mock('controls', function () {})

	injector.require(['map_view', 'layers', 'controls'], function (
		MapView,
		layers,
		controls
	) {
		//run test
		options.map_outer_container_element = testDiv
		var map = new MapView(new Config(options))
		var leafletMap = map.getMap()
		//inspect
		verify(leafletMap, map, layers, layersMock)
		//tear down
		injector.clean()
		done()
	})
}
