define(["Squire", "sinon", "leaflet", "jquery", "points_view", "config", "controls"],
	function(Squire, Sinon, leaflet, $, PointsView, Config, Controls) {
		
		QUnit.module('points view', function() {
			function testIcon(assert, type, name, condition, url, extraTexts, exportName) {
				//test
				var marker = {
					latLng: [-0.09, 51.505],
					icon: type,
					url: url,
					extraTexts: extraTexts,
					exportName: exportName,
					name: name
				};
				var pointsView = dummyMap(PointsView, { cluster: false }, [marker]);
				pointsView.finish(function() {});//callback not needed as not async here
				//verify
				var markerElements = $('img.leaflet-marker-icon');
				assert.ok(markerElements.length === 1, "should just be one marker icon");
				assert.ok(markerElements.is(":visible"), "should be visible");
				return pointsView;
			}
			
			QUnit.test('should accept null name', function(assert) {
				var name = null;
				var url = "http://example/";
				var pointsView = testIcon(assert, undefined, name, undefined, url);
				$text = getOneMarkerText(assert, pointsView);
				assert.equal($text.text(), url + 'View on google mapsView on bing mapsView on geohack');
				assert.equal($('a', $text).attr('href'), url);
			});
			
			QUnit.test('should accept null url', function(assert) {
				var name = "this is my name";
				var url = null;
				var pointsView = testIcon(assert, undefined, name, undefined, url);
				$text = getOneMarkerText(assert, pointsView);
				assert.equal($text.text(), name + 'View on google mapsView on bing mapsView on geohack');
				assert.equal($('a', $text).length, 3, "should not be any links other than the three at the bottom");
			});
			
			QUnit.test('should include extra text', function(assert) {
				var name = null;
				var url = "http://example/";
				var extraTexts = ["abc", "this is more text", "blah", 100];
				var pointsView = testIcon(assert, undefined, name, undefined, url, extraTexts);
				$text = getOneMarkerText(assert, pointsView);
				extraTexts.forEach(function(extraText) {
					assert.notEqual($text.text().indexOf(extraText), -1);//just check it's included, we're not too concerned where
				});
			});

			QUnit.test('basic marker should display', function(assert) {
				testIcon(assert);
				var markerIconSource = $('img.leaflet-marker-icon')[0].src
				assert.ok(/.*\/marker\-icon(\-[\d\w]+)?\.png/.test(markerIconSource), "should be a standard marker icon, was: " + markerIconSource);
			});
			
			QUnit.test('marker should display based on type', function(assert) {
				testIcon(assert, 'Pillar');
				var markerIconSource = $('img.leaflet-marker-icon')[0].src
				assert.ok(/.*img\/pillar\.png/.test(markerIconSource), "should be a pillar marker icon, was: " + markerIconSource);
			});
			
			QUnit.test('marker should display text', function(assert) {
				var name = "this is my name";
				var pointsView = testIcon(assert, undefined, name);
				$text = getOneMarkerText(assert, pointsView);
				assert.equal($text.text(), name + 'View on google mapsView on bing mapsView on geohack');
			});
			
			QUnit.test('marker should not allow XSS', function(assert) {
				var name = '<img>';
				var url = '"><hr></a><a href="';//some browsers decode the html within the href so, set this to be something different so we can check for it later
				var exportName = '<img>';
				var extraTexts = ['<img>', '<img>'];
				var pointsView = testIcon(assert, undefined, name, undefined, url, extraTexts, exportName);
				$text = getOneMarkerText(assert, pointsView);
				assert.equal($text.html().indexOf('<img'), -1);
				assert.equal($('hr', $text).length, 0);//will appear in the text, but not in the actual dom
			});
			
			QUnit.module('clustering and layering', function() {
				QUnit.test('cluster layer should work and should have required markers', function(assert) {
					var done = assert.async();
					var initialMarkers = [
						{
							latLng: [-0.09, 51.505],
							name: 'abc'
						},
						{
							latLng: [-0.09, 51.505],
							name: 'def'
						}
					];
					
					var injector = new Squire();
					var leafletClusterMock = sinon.stub();
					var leafletClusterSpy = sinon.spy(function() {return leafletClusterMock});
					leafletClusterMock.addLayers = sinon.stub();
					leafletClusterMock.addTo = sinon.stub();
					injector.mock('leaflet_cluster', leafletClusterSpy);
					injector.require(['points_view'],
						function(PointsView) {
							var pointsView = dummyMap(PointsView, {cluster: true}, initialMarkers);
							pointsView.finish(function() {});
							//check leaflet_cluster constructor is called
							assert.ok(leafletClusterSpy.calledOnce, "cluster layer group is needed");
							//check all markers are added
							assert.ok(leafletClusterMock.addLayers.calledOnce, "should have added layers");
							var markers = leafletClusterMock.addLayers.getCall(0).args[0];
							assert.equal(2, markers.length, "should have added both markers");
							assert.equal(getContentText(markers[0]), 'abc' + 'View on google mapsView on bing mapsView on geohack');
							assert.equal(getContentText(markers[1]), 'def' + 'View on google mapsView on bing mapsView on geohack');
							//check cluster layer is added to the map
							assert.ok(leafletClusterMock.addTo.calledOnce, "should have added layer to map");
							//tidy
							injector.clean();
							done();
						}
					);
				});
				
				QUnit.test('matrix layers should be set up correctly', function(assert) {
					var done = assert.async();
					var name1 = 'abc';
					var name2 = 'def';
					var name3 = 'ghi';
					var name4 = 'jkl';
					var type1 = 'type1';
					var type2 = 'type2';
					var condition1 = 'condition1';
					var condition2 = 'condition2';
					var initialMarkers = {
						type1 : {
							condition1: [
								{
									latLng: [-0.06, 51.505],
									name: name1
								},
							],
							condition2: [
								{
									latLng: [-0.07, 51.506],
									name: name2
								}
							]
						},
						type2 : {
							condition1: [
								{
									latLng: [-0.08, 51.507],
									name: name3
								},
							],
							condition2: [
								{
									latLng: [-0.09, 51.508],
									name: name4
								}
							]
						}
					};
					
					var injector = new Squire();
					var MatrixlayersMock = sinon.stub();
					MatrixlayersMock.prototype.addTo = sinon.stub();
					var addAspectStub = sinon.stub();
					MatrixlayersMock.prototype.addAspect = addAspectStub;
					injector.mock('leaflet_matrixlayers', MatrixlayersMock);
					injector.require(['points_view'],
						function(PointsView) {
							var pointsView = dummyMap(PointsView, {cluster: false, dimensional_layering: true}, initialMarkers);
							pointsView.finish(function() {});
							//check matrix layers constructor is called
							assert.ok(MatrixlayersMock.calledOnce, "matrix layer control is needed");
							//check all markers are added
							var actualMarkers = addAspectStub.getCall(0).args[1];
							assert.ok(getContentText(actualMarkers[type1 + '/' + condition1].getLayers()[0]), name1);
							assert.ok(getContentText(actualMarkers[type1 + '/' + condition2].getLayers()[0]), name2);
							assert.ok(getContentText(actualMarkers[type2 + '/' + condition1].getLayers()[0]), name3);
							assert.ok(getContentText(actualMarkers[type2 + '/' + condition2].getLayers()[0]), name4);
							// //check cluster layer is added to the map
							var found = false;
							for (var i = 0; i < pointsView._controls._controlsToAdd.length; i++) {
								found |= pointsView._controls._controlsToAdd[i] instanceof MatrixlayersMock;
							}
							assert.ok(found, "should have added layer to map");
							//tidy
							injector.clean();
							done();
						}
					);
				});
			});
		});
		
		function dummyMap(PointsView, options, markerList) {
			$('#qunit-fixture').append('<div id="map" style="height: 180px;"></div>');
			var map = leaflet.map('map', {maxZoom: 10});
			map.setView([51.505, -0.09], 13);
			var bundle = {
				icons: {
					Pillar: leaflet.icon({
						iconUrl: window.os_map_base + 'img/pillar.png',
						iconAnchor: [10, 40], // point of the icon which will correspond to marker's location
						popupAnchor: [1, -38] // point from which the popup should open relative to the iconAnchor
					})
				}
			};
			var config = new Config(options, [bundle]);
			var pointsModel = {};
			pointsModel.getMarkerList = function() {return markerList};
			pointsModel.getBundleConfig = function() {return bundle};
			pointsModel.getAttribution = function() {return "attributiongoeshere"};
			var layers = {};
			var pointsView = new PointsView(map, config, {testbundle: pointsModel}, new Controls(config, layers), layers);
			return pointsView;
		}
		
		function getOneMarkerText(assert, pointsView) {
			var markerTexts = getAllMarkerTexts(pointsView)
			assert.equal(markerTexts.length, 1);
			return $('<div>' + markerTexts[0] + '</div>');
		}

		function getContentText(marker) {
			return $('<div>' + marker.getPopup().getContent() + '</div>').text();
		}
		
		function getAllMarkerTexts(pointsView) {
			var markerTexts = [];
			var map = pointsView._map;
			$.each(map._layers, function (ml) {
				var layers = map._layers[ml]._layers;
				if (layers !== undefined) {
					Object.keys(layers).forEach(function (key) { 
						var feature = layers[key]
						if (feature.getPopup() && feature.getPopup().getContent()) {
							markerTexts.push(feature.getPopup().getContent());
						}
					})
				}
			});
			return markerTexts;
		}
	}
);
