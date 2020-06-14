define(['Squire', 'sinon', 'leaflet', 'config'],
	function(Squire, sinon, leaflet, Config) {

		QUnit.module('layers', function(hooks) {
			function clearLocalStorage() {
				if (localStorage !== undefined) {
					localStorage.clear();
				}
			}
			hooks.beforeEach(function() {
				clearLocalStorage();
			});
			
			QUnit.test('added even with no config', function(assert) {
				runTest(assert, {}, "OS");
			});
			QUnit.module('added based on config', function(hooks) {
				QUnit.test('os', function(assert) {
					runTest(assert, {defaultLayer: "OS"}, "OS");
				});
				QUnit.test('bing', function(assert) {
					runTest(assert, {defaultLayer: "Bing Roads"}, "Bing Roads");
				});
				QUnit.test('osm', function(assert) {
					runTest(assert, {defaultLayer: "OSM"}, "OSM");
				});
			});
			QUnit.test('choice persisted', function(assert) {
				//no local storage, so should use configured option
				runTest(assert, {defaultLayer: "OS"}, "OS", function(layers, map) {
					Object.keys(layers).forEach(function (key) {
						map.removeLayer(layers[key]);
					});
					layers["OSM"].addTo(map);
					map.remove();//clear up from previous test
					//persisted choice should have overridden local storage option
					runTest(assert, {defaultLayer: "OS"}, "OSM");
				});
			});
		});
				
		function runTest(assert, options, expected, callback) {
			var done = assert.async();
		
			$('#qunit-fixture').append('<div id="map" style="height: 180px;"></div>');

			var injector = new Squire();
			var layersMock = {};
			mockAddable(injector, 'leaflet_bing');
			
			injector.require(['layers'],
				function(layers) {
					//run test
					var map = new leaflet.Map('map', {center: [0, 0], zoom: 0});
					var resultingLayers = layers(map, new Config(options));
					//check the expected layers were added
					for (var id in resultingLayers) {
						if (expected === id) {
							if (resultingLayers[id].addTo.calledOnce != undefined) {
								assert.ok(resultingLayers[id].addTo.calledOnce, id);
							} else {
								assert.ok(map.hasLayer(resultingLayers[id]), id);
							}
						} else {
							if (resultingLayers[id].addTo.calledOnce != undefined) {
								assert.notOk(resultingLayers[id].addTo.called, id);
							} else {
								assert.notOk(map.hasLayer(resultingLayers[id]), id);
							}
						}
					}
					//tear down
					injector.clean();
					if (callback != null) {
						callback(resultingLayers, map);
					}
					done();
				}
			);
		}
		
		function mockAddable(injector, name) {
 			var mock = {
 				name: name,//makes debugging easier
				//I feel like there ought to be a better way to mock layers, but I'm not sure what it is right now
 				addTo: function(){},
				on: function(){},
				_layerAdd: function(){},
				onRemove: function(){},
				fire: function(){}
 			};
 			sinon.spy(mock, "addTo");
			injector.mock(name, function() {return mock;});
		}
	}
);
