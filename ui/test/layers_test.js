import Squire from 'Squire'
import sinon from 'sinon'
import leaflet from 'leaflet'
import Config from '../src/js/config.js'

let assert = eval('chai.assert')

describe('layers', function () {
	function clearLocalStorage() {
		if (localStorage !== undefined) {
			localStorage.clear()
		}
	}
	hooks.beforeEach(function () {
		clearLocalStorage()
	})

	it('added even with no config', function () {
		runTest(assert, {}, 'OS')
	})
	describe('added based on config', function () {
		it('os', function () {
			runTest(
				assert,
				{
					defaultLayer: 'OS'
				},
				'OS'
			)
		})
		it('bing', function () {
			runTest(
				assert,
				{
					defaultLayer: 'Bing Roads'
				},
				'Bing Roads'
			)
		})
		it('osm', function () {
			runTest(
				assert,
				{
					defaultLayer: 'OSM'
				},
				'OSM'
			)
		})
	})
	it('choice persisted', function () {
		//no local storage, so should use configured option
		runTest(
			assert,
			{
				defaultLayer: 'OS'
			},
			'OS',
			function (layers, map) {
				Object.keys(layers).forEach(function (key) {
					map.removeLayer(layers[key])
				})
				layers['OSM'].addTo(map)
				map.remove() //clear up from previous test
				//persisted choice should have overridden local storage option
				runTest(
					assert,
					{
						defaultLayer: 'OS'
					},
					'OSM'
				)
			}
		)
	})
})

function runTest(assert, options, expected, callback) {
	var done = assert.async()

	$('#test-fixture').append('<div id="map" style="height: 180px;"></div>')

	var injector = new Squire()
	var layersMock = {}
	mockAddable(injector, 'leaflet_bing')

	injector.require(['layers'], function (layers) {
		//run test
		var map = new leaflet.Map('map', {
			center: [0, 0],
			zoom: 0
		})
		var resultingLayers = layers(map, new Config(options))
		//check the expected layers were added
		for (var id in resultingLayers) {
			if (expected === id) {
				if (resultingLayers[id].addTo.calledOnce != undefined) {
					assert.ok(resultingLayers[id].addTo.calledOnce, id)
				} else {
					assert.ok(map.hasLayer(resultingLayers[id]), id)
				}
			} else {
				if (resultingLayers[id].addTo.calledOnce != undefined) {
					assert.notOk(resultingLayers[id].addTo.called, id)
				} else {
					assert.notOk(map.hasLayer(resultingLayers[id]), id)
				}
			}
		}
		//tear down
		injector.clean()
		if (callback != null) {
			callback(resultingLayers, map)
		}
		done()
	})
}

function mockAddable(injector, name) {
	var mock = {
		name: name, //makes debugging easier
		//I feel like there ought to be a better way to mock layers, but I'm not sure what it is right now
		addTo: function () {},
		on: function () {},
		_layerAdd: function () {},
		onRemove: function () {},
		fire: function () {}
	}
	sinon.spy(mock, 'addTo')
	injector.mock(name, function () {
		return mock
	})
}
