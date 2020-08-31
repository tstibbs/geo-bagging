import $ from 'jquery'
import leaflet from 'leaflet'
import Screenposition_Osgb from '../src/js/screenposition_osgb'

let assert = eval('chai.assert')

describe('screenposition_osgb', function () {
	it('should display location', function () {
		//set up
		$('#test-fixture').append(
			'<div id="map" style="height: 200px; width: 200px;"></div>'
		)
		var map = leaflet.map('map')
		map.setView([51.505, -0.09], 13)
		var $positionDisplay = $('div#map div.leaflet-control-mapcentercoord')
		//check that it hasn't shown up yet, just to validate the rest of our test
		assert.equal(0, $positionDisplay.length)
		//add the class under test
		new Screenposition_Osgb().addTo(map)
		//now check that the mouse position element is showing up
		$positionDisplay = $('div#map div.leaflet-control-mapcentercoord')
		assert.equal(1, $positionDisplay.length)
		assert.ok($positionDisplay.is(':visible'))
		var text = $positionDisplay.text()
		assert.equal(text, 'TQ 32658 80180')
	})

	it('clicking should show or hide crosshairs', function () {
		//set up
		$('#test-fixture').append('<div id="map" style="height: 180px;"></div>')
		var map = leaflet.map('map')
		map.setView([51.505, -0.09], 13)
		new Screenposition_Osgb().addTo(map)
		//show cross hairs
		var $positionDisplay = $('div#map div.leaflet-control-mapcentercoord')
		$positionDisplay.click()
		var $icon = $('div.leaflet-control-mapcentercoord-icon.leaflet-zoom-hide') //the div _is_ the icon (it uses css to display the image), there is no img element
		assert.equal(1, $icon.length)
		assert.equal('visible', $icon.css('visibility'))
		//hide cross hairs
		$positionDisplay.click()
		assert.equal('hidden', $icon.css('visibility'))
		//sanity check - show cross hairs
		$positionDisplay.click()
		assert.equal('visible', $icon.css('visibility'))
	})
})
