define(['jquery', 'conversion', 'main'],
	function($, conversion, main) {
		return {
			showMap: function() {
				if (/^https?:\/\/trigpointing\.uk\/trig\/\d+/.test(window.location.href)) {
					//e.g. http://trigpointing.uk/trig/2614 - single trig page
					this.embedSingleMap();
				} else if (/^https?:\/\/trigpointing\.uk\/trigs\/view-trigs\.php.*/.test(window.location.href)) {
					//e.g. http://trigpointing.uk/trigs/view-trigs.php?q=2168478 - detailed search page
					this.showMapForSearch();
				} else if (/^https?:\/\/trigpointing\.uk\/trigtools\/find.php.*/.test(window.location.href)) {
					//e.g. http://trigpointing.uk/trigtools/find.php?t=milton - 'quick search' page (not supported)
					alert("Map display not supported on this page, please use the 'detailed search' page instead: http://trigpointing.uk/trigs/");
				} else {
					alert("Map display not supported on this page.");
				}
			},
			
			showMapForSearch: function() {
				this.getPointsFromSearch(window.location.search, function(points) {
					var options = {
						pointsToLoad: {
							generalPoints: points
						},
						force_config_override: true,
						use_sidebar: false
					};
					
					$('body').empty();//our map assumes it is full screen - there's probably a better way, but this will work for now
					var osMap = main.loadMap(options);
					
					//now get the map showing everything
                    var minEastings;
                    var maxEastings;
                    var minNorthings;
                    var maxNorthings;
                    
                    var latLngs = points.forEach(function(point) {
                        var eastings = point.eastings
                        var northings = point.northings;
                        if (minEastings == null || eastings < minEastings) {
                            minEastings = eastings;
                        }
                        if (maxEastings == null || eastings > maxEastings) {
                            maxEastings = eastings;
                        }
                        if (minNorthings == null || northings < minNorthings) {
                            minNorthings = northings;
                        }
                        if (maxNorthings == null || northings > maxNorthings) {
                            maxNorthings = northings;
                        }
                    });
					
					var bottomLeft = conversion.osgbToLngLat(minEastings, minNorthings);
					var topRight = conversion.osgbToLngLat(maxEastings, maxNorthings);
                    osMap.getMap().fitBounds([[bottomLeft[1], bottomLeft[0]], [topRight[1], topRight[0]]]);
				});
			},
			
			embedSingleMap: function() {
				var centreGridRef = $("div:contains('Grid reference : '):not(:has(*)) + div a").text();
				var lngLat = conversion.gridRefToLngLat(centreGridRef);
				var lng = lngLat[0];
				var lat = lngLat[1];
				
				var searchUrl = $("a:contains('trigpoints')").attr('href')
				$.ajax(searchUrl).done(function(res, status, xhr) {
					var $searchResult = $($.parseHTML(res));
					var flashLink = $searchResult.find("a:contains('Interactive Map')").attr('href');
					var suffix = '?' + flashLink.split('?')[1];
					this.getPointsFromSearch(suffix, function(points) {
						var mapDiv = $('map[name="trigmap"]').parent();
						mapDiv.empty();

						//get 'this' trig id
						var id = window.location.pathname.split(/\//).pop();
						id = /0*([^0].*)/.exec(id)[1];//strip any leading zeros
						
						var significantPoint = null;
						points = points.filter(function(point) {
							if (point.id == id) {
								significantPoint = point;
								return false;
							} else {
								return true;
							}
						});
						var options = {
							map_style: 'mini_embedded',
							cluster: false,
							hider_control_start_visible: false,
							show_hider_control: true,
							start_position: [lat, lng],
							map_outer_container_element: mapDiv,
							pointsToLoad: {
								significantPoint: significantPoint,
								generalPoints: points
							},
							force_config_override: true,
							initial_zoom: 13,
							use_sidebar: false
						};
						
						main.loadMap(options);
					});
				}.bind(this));
			},
			
			getPointsFromSearch: function(suffix, callback) {
				$.get('/trigs/down-flash.php' + suffix, function(data, textStatus, jqXHR) {
					var regex = /Showing trigpoints \d+ to \d+ of (\d+)/g;
					var allText = $('body').text();
					
					var showMap;
					if (regex.test(allText) && parseInt(regex.exec(allText)[1]) > 1000) {
						showMap = confirm("Map will only display the first 1000 points, are you sure you want to continue?");
					} else {
						showMap = true;
					}

					if (showMap === true) {
						var decodedXmlString = decodeURIComponent(data);
						var dom = $($.parseXML(decodedXmlString));
						var points = dom.find('C').map(function(i, element) {
							//e.g. <C D='Castlebythe Barrow' I='2041' E='202873' N='229647' F='n'/>
							var point = $(element);
							var id = point.attr('I');
							var url = 'http://trigpointing.uk/trig/' + id;
							return {
								eastings: point.attr('E'),
								northings: point.attr('N'),
								url: url,
								id: id,
								name: point.attr('D')
							};
						}).toArray();
						callback(points);
					}
				});
			}
		}
	}
);
