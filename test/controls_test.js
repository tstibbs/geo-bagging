define(['Squire', 'sinon', 'config', 'leaflet'],
	function(Squire, sinon, Config, leaflet) {

		QUnit.module('controls', function(hooks) {			
			QUnit.module('location displays', function() {
				QUnit.test('non-mobile', function(assert) {
					runTest(assert, false, {}, '', function(leafletMap, dummy, mouseposition_osgb_mock, screenposition_osgb_mock) {
						//check screen/mouse position is applied correctly based on a desktop browser
						assert.ok(mouseposition_osgb_mock().addTo.calledOnce, "mouse position should be displayed");
						assert.notOk(screenposition_osgb_mock().addTo.calledOnce, "screen position should not be displayed");
					});
				});
				
				QUnit.test('mobile', function(assert) {
					runTest(assert, true, {}, '', function(leafletMap, dummy, mouseposition_osgb_mock, screenposition_osgb_mock) {
						//check screen/mouse position is applied correctly based on a mobile browser
						assert.notOk(mouseposition_osgb_mock().addTo.calledOnce, "mouse position should not be displayed");
						assert.ok(screenposition_osgb_mock().addTo.calledOnce, "screen position should be displayed");
					});
				});
			});

			function controlIncludedWhen(moduleName, option, depName, displaysOnMobile) {
				QUnit.module(moduleName, function() {
					QUnit.test("should display", function(assert) {
						var options = {};
						options[option] = true;
						var isMobile = (displaysOnMobile == true);
						console.log(moduleName + "-should-" + isMobile);
						runTest(assert, isMobile, options, depName, 
							function(leafletMap, specifiedMock) {
								assert.ok(specifiedMock().addTo.calledOnce, moduleName + " should be displayed");
							}
						);
					});
					
					QUnit.test("shouldn't display", function(assert) {
						var options = {};
						options[option] = false;
						var isMobile = displaysOnMobile != undefined && !displaysOnMobile;
						console.log(moduleName + "-shouldn't-" + isMobile);
						runTest(assert, isMobile, options, depName,
							function(leafletMap, specifiedMock) {
								assert.notOk(specifiedMock().addTo.calledOnce, moduleName + " should not be displayed");
							}
						);
					});
				});
			}
			
			controlIncludedWhen('location control', 'show_locate_control', 'locate');
			controlIncludedWhen('selection control', 'show_selection_control', 'selection');
			controlIncludedWhen('search control', 'show_search_control', 'leaflet_geosearch');
			//controlIncludedWhen('layers control', 'show_layers_control', 'locate');
			controlIncludedWhen('hider control', '', 'leaflet_controlHider', true);
		});
				
		function runTest(assert, isMobile, options, depName, verify) {
			var done = assert.async();
		
			$('#qunit-fixture').append('<div id="map" style="height: 180px;"></div>');

			var injector = new Squire();
			injector.mock('mobile', {isMobile: function() {return isMobile;}});
			mockAddable(injector, 'mouseposition_osgb');
			mockAddable(injector, 'screenposition_osgb');
			mockAddable(injector, 'leaflet_geosearch_osm');
			
			var deps = ['controls', 'mouseposition_osgb', 'screenposition_osgb'];
			if (depName != '') {
				mockAddable(injector, depName);
				deps.push(depName);
			}
            injector.require(deps,
                function(Controls, mouseposition_osgb, screenposition_osgb, specifiedMock) {
					//run test
					var leafletMap = new leaflet.Map('map');
					new Controls(new Config(options)).addAllTo(leafletMap);
					//inspect
					verify(leafletMap, specifiedMock, mouseposition_osgb, screenposition_osgb);
					//tear down
					injector.clean();
					done();
				}
			);
		}

		function mockAddable(injector, name) {
 			var mock = {
 				name: name,
 				addTo: function(){}
 			};
 			sinon.spy(mock, "addTo");
			injector.mock(name, function() {return mock;});
		}
	}
);