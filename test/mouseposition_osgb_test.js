define(["leaflet", "jquery", "mouseposition_osgb"],
	function(leaflet, $, Mouseposition_Osgb) {
		QUnit.test("mouseposition_osgb - should display", function(assert) {
			var $mapElement = $('<div id="map" style="height: 200px; width: 200px;"></div>');
			$('#qunit-fixture').append($mapElement);
			var map = leaflet.map('map');
			map.setView([51.505, -0.09], 13);//must set view in order for the position to be calculated
			var $positionDisplay = $('div#map div.leaflet-control-mouseposition');
			//check that it hasn't shown up yet, just to validate the rest of our test
			assert.equal(0, $positionDisplay.length);
			//add the class under test
			new Mouseposition_Osgb().addTo(map);
			//now check that the mouse position element is showing up
			$positionDisplay = $('div#map div.leaflet-control-mouseposition');
			assert.equal(1, $positionDisplay.length);
			assert.ok($positionDisplay.is(":visible"));
			//move mouse to top left and check expected coords
			moveMouse($mapElement, 1, 1);
			assert.equal($positionDisplay.text(), ' TQ 31354 81419');
			//move mouse to bottom right and check expected coords
			moveMouse($mapElement, 199, 199);
			assert.equal($positionDisplay.text(), ' TQ 33774 79128');
		});
		
		function moveMouse($mapElement, x, y) {
			var event;
			try {
				//proper browsers
				event = new MouseEvent('mousemove', {
					'clientX': x,
					'clientY': y
				});
			} catch (err) {
				//phantomjs doesn't behave like a normal browser...
				event = document.createEvent('MouseEvent');
				event.initMouseEvent('mousemove', true, false, null, null, x, y, x, y, null, null, null, null, null, null);
			}
			$mapElement[0].dispatchEvent(event);
		}
	}
);

