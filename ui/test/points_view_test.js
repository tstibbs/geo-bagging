import Squire from 'Squire'
import Sinon from 'sinon'
import leaflet from 'leaflet'
import $ from 'jquery'
import PointsView from '../src/js/points_view'
import Config from '../src/js/config'
import Controls from '../src/js/controls'

let assert = eval('chai.assert')

describe('points view', function () {
	function testIcon(
		assert,
		type,
		name,
		condition,
		url,
		extraTexts,
		exportName
	) {
		//test
		var marker = {
			latLng: [-0.09, 51.505],
			icon: type,
			url: url,
			extraTexts: extraTexts,
			exportName: exportName,
			name: name
		}
		var pointsView = dummyMap(
			PointsView,
			{
				cluster: false
			},
			[marker]
		)
		pointsView.finish(function () {}) //callback not needed as not async here
		//verify
		var markerElements = $('img.leaflet-marker-icon')
		assert.ok(markerElements.length === 1, 'should just be one marker icon')
		assert.ok(markerElements.is(':visible'), 'should be visible')
		return pointsView
	}

	it('should accept null name', function () {
		var name = null
		var url = 'http://example/'
		var pointsView = testIcon(assert, undefined, name, undefined, url)
		$text = getOneMarkerText(assert, pointsView)
		assert.equal(
			$text.text(),
			url + 'View on google mapsView on bing mapsView on geohack'
		)
		assert.equal($('a', $text).attr('href'), url)
	})

	it('should accept null url', function () {
		var name = 'this is my name'
		var url = null
		var pointsView = testIcon(assert, undefined, name, undefined, url)
		$text = getOneMarkerText(assert, pointsView)
		assert.equal(
			$text.text(),
			name + 'View on google mapsView on bing mapsView on geohack'
		)
		assert.equal(
			$('a', $text).length,
			3,
			'should not be any links other than the three at the bottom'
		)
	})

	it('should include extra text', function () {
		var name = null
		var url = 'http://example/'
		var extraTexts = ['abc', 'this is more text', 'blah', 100]
		var pointsView = testIcon(
			assert,
			undefined,
			name,
			undefined,
			url,
			extraTexts
		)
		$text = getOneMarkerText(assert, pointsView)
		extraTexts.forEach(function (extraText) {
			assert.notEqual($text.text().indexOf(extraText), -1) //just check it's included, we're not too concerned where
		})
	})

	it('basic marker should display', function () {
		testIcon(assert)
		var markerIconSource = $('img.leaflet-marker-icon')[0].src
		assert.ok(
			/.*\/marker\-icon(\-[\d\w]+)?\.png/.test(markerIconSource),
			'should be a standard marker icon, was: ' + markerIconSource
		)
	})

	it('marker should display based on type', function () {
		testIcon(assert, 'Pillar')
		var markerIconSource = $('img.leaflet-marker-icon')[0].src
		assert.ok(
			/.*img\/pillar\.png/.test(markerIconSource),
			'should be a pillar marker icon, was: ' + markerIconSource
		)
	})

	it('marker should display text', function () {
		var name = 'this is my name'
		var pointsView = testIcon(assert, undefined, name)
		$text = getOneMarkerText(assert, pointsView)
		assert.equal(
			$text.text(),
			name + 'View on google mapsView on bing mapsView on geohack'
		)
	})

	it('marker should not allow XSS', function () {
		var name = '<img>'
		var url = '"><hr></a><a href="' //some browsers decode the html within the href so, set this to be something different so we can check for it later
		var exportName = '<img>'
		var extraTexts = ['<img>', '<img>']
		var pointsView = testIcon(
			assert,
			undefined,
			name,
			undefined,
			url,
			extraTexts,
			exportName
		)
		$text = getOneMarkerText(assert, pointsView)
		//strings may appear in the text, but not in the actual dom
		assert.equal($('img', $text).length, 0)
		assert.equal($('hr', $text).length, 0)
	})

	describe('clustering and layering', function () {
		it('cluster layer should work and should have required markers', function () {
			var done = assert.async()
			var initialMarkers = [
				{
					latLng: [-0.09, 51.505],
					name: 'abc'
				},
				{
					latLng: [-0.09, 51.505],
					name: 'def'
				}
			]

			var injector = new Squire()
			var clusterLayerMock = {}
			var leafletClusterSpy = {}
			leafletClusterSpy.MarkerClusterGroup = sinon.spy(function () {
				return clusterLayerMock
			})
			clusterLayerMock.addLayers = sinon.stub()
			clusterLayerMock.addTo = sinon.stub()
			injector.mock('leaflet_cluster', leafletClusterSpy)
			injector.require(['points_view'], function (PointsView) {
				var pointsView = dummyMap(
					PointsView,
					{
						cluster: true
					},
					initialMarkers
				)
				pointsView.finish(function () {})
				//check leaflet_cluster constructor is called
				assert.ok(
					leafletClusterSpy.MarkerClusterGroup.calledOnce,
					'cluster layer group is needed'
				)
				//check all markers are added
				assert.ok(
					clusterLayerMock.addLayers.calledOnce,
					'should have added layers'
				)
				var markers = clusterLayerMock.addLayers.getCall(0).args[0]
				assert.equal(2, markers.length, 'should have added both markers')
				assert.equal(
					getContentText(markers[0]),
					'abc' + 'View on google mapsView on bing mapsView on geohack'
				)
				assert.equal(
					getContentText(markers[1]),
					'def' + 'View on google mapsView on bing mapsView on geohack'
				)
				//check cluster layer is added to the map
				assert.ok(
					clusterLayerMock.addTo.calledOnce,
					'should have added layer to map'
				)
				//tidy
				injector.clean()
				done()
			})
		})
	})
})

function dummyMap(PointsView, options, markerList) {
	var testDiv = $('<div></div>')
	testDiv.append('<div id="map" style="height: 180px;"></div>')
	$('#test-fixture').append(testDiv)
	options.map_outer_container_element = testDiv

	var map = leaflet.map('map', {
		maxZoom: 10
	})
	map.setView([51.505, -0.09], 13)
	var bundle = {
		icons: {
			Pillar: leaflet.icon({
				iconUrl: window.geoBaggingBaseUrl + 'img/pillar.png',
				iconAnchor: [10, 40], // point of the icon which will correspond to marker's location
				popupAnchor: [1, -38] // point from which the popup should open relative to the iconAnchor
			})
		}
	}
	var config = new Config(options, [bundle])
	var pointsModel = {}
	pointsModel.getMarkerList = function () {
		return markerList
	}
	pointsModel.getBundleConfig = function () {
		return bundle
	}
	pointsModel.getAttribution = function () {
		return 'attributiongoeshere'
	}
	var layers = {}
	var manager = {
		getConfig: function () {
			return config
		}
	}
	var controls = new Controls(config, layers, null, manager)
	var pointsView = new PointsView(
		map,
		config,
		{
			testbundle: pointsModel
		},
		null,
		controls,
		layers
	)
	return pointsView
}

function getOneMarkerText(assert, pointsView) {
	var markerTexts = getAllMarkerTexts(pointsView)
	assert.equal(markerTexts.length, 1)
	return $('<div>' + markerTexts[0] + '</div>')
}

function getContentText(marker) {
	return $('<div>' + marker.getPopup().getContent() + '</div>').text()
}

function getAllMarkerTexts(pointsView) {
	var markerTexts = []
	var map = pointsView._map
	$.each(map._layers, function (ml) {
		var layers = map._layers[ml]._layers
		if (layers !== undefined) {
			Object.keys(layers).forEach(function (key) {
				var feature = layers[key]
				if (feature.getPopup() && feature.getPopup().getContent()) {
					markerTexts.push(feature.getPopup().getContent())
				}
			})
		}
	})
	return markerTexts
}
