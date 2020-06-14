define(['Squire', 'sinon', 'config', 'leaflet', 'manager'],
	function(Squire, sinon, Config, leaflet, Manager) {

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

			function controlIncludedWhen(moduleName, option, defaultValue, depName, displaysOnMobile) {
				QUnit.module(moduleName, function() {
					QUnit.test("should display", function(assert) {
						var options = {};
						options[option] = defaultValue != null ? defaultValue : true;
						var isMobile = (displaysOnMobile == true);
						runTest(assert, isMobile, options, depName, 
							function(leafletMap, specifiedMock) {
								assert.ok(specifiedMock().addTo.calledOnce, moduleName + " should be displayed");
							}
						);
					});
					
					QUnit.test("shouldn't display", function(assert) {
						var options = {};
						options[option] = defaultValue != null ? defaultValue : false;
						var isMobile = (displaysOnMobile == false);
						runTest(assert, isMobile, options, depName,
							function(leafletMap, specifiedMock) {
								assert.notOk(specifiedMock().addTo.calledOnce, moduleName + " should not be displayed");
							}
						);
					});
				});
			}
			
			controlIncludedWhen('location control', 'show_locate_control', null, 'locate');
			controlIncludedWhen('selection control', 'show_selection_control', null, 'selection');
			controlIncludedWhen('search control', 'show_search_control', null, 'leaflet_geosearch');
			//controlIncludedWhen('layers control', 'show_layers_control', 'locate');
			controlIncludedWhen('hider control (property controlled)', 'show_hider_control', null, 'leaflet_controlHider');
			controlIncludedWhen('hider control (mobile controlled)', 'show_hider_control', 'mobile', 'leaflet_controlHider', true);
		});
				
		function runTest(assert, isMobile, options, depName, verify) {
			var done = assert.async();
		
			var testDiv = $('<div></div>');
			testDiv.append('<div id="map" style="height: 180px;"></div>');
			$('#qunit-fixture').append(testDiv);

			var injector = new Squire();
			injector.mock('mobile', {isMobile: function() {return isMobile;}});
			mockAddable(injector, 'mouseposition_osgb');
			mockAddable(injector, 'screenposition_osgb');
			mockAddable(injector, 'leaflet_geosearch_bing');
			
			var deps = ['controls', 'mouseposition_osgb', 'screenposition_osgb'];
			if (depName != '') {
				mockAddable(injector, depName);
				deps.push(depName);
			}
            injector.require(deps,
                function(Controls, mouseposition_osgb, screenposition_osgb, specifiedMock) {
					//run test
					var leafletMap = new leaflet.Map('map');
					options.map_outer_container_element = testDiv;
					var config = new Config(options);
					var manager = {
						getConfig: function() {return config;}
					};
					new Controls(config, {}, leafletMap, manager);
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
