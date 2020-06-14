define(["leaflet", "jquery", "mouseposition_osgb"],
	function(leaflet, $, Mouseposition_Osgb) {
		//polyfill for IE
		(function (window) {
			try {
				new MouseEvent('test');
				return false; // No need to polyfill
			} catch (e) {
				// Need to polyfill - fall through
			}

			// Polyfills DOM4 MouseEvent

			var MouseEvent = function (eventType, params) {
				params = params || { bubbles: false, cancelable: false };
				var mouseEvent = document.createEvent('MouseEvent');
				mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, params.screenX || 0, params.screenY || 0, params.clientX || 0, params.clientY || 0, false, false, false, false, 0, null);

				return mouseEvent;
			}

			MouseEvent.prototype = Event.prototype;

			window.MouseEvent = MouseEvent;
		})(window);
		
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
			assert.equal($positionDisplay.text(), ' TQ 31452 81326');
			//move mouse to bottom right and check expected coords
			moveMouse($mapElement, 199, 199);
			assert.equal($positionDisplay.text(), ' TQ 33872 79035');
		});
		
		function moveMouse($mapElement, x, y) {
			var bounds = $mapElement[0].getBoundingClientRect();
			var clientX = bounds.left + x;
			var clientY = bounds.top + y;
			var event = new MouseEvent('mousemove', {
				'clientX': clientX,
				'clientY': clientY
			});
			$mapElement[0].dispatchEvent(event);
		}
	}
);

