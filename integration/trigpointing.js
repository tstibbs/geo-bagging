//$.getScript("https://tstibbs.github.io/geo-bagging/integration/trigpointing.js");

$.get('down-flash.php' + window.location.search, function(data) {
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
			var url = 'http://trigpointing.uk/trig/' + point.attr('I');
			return {
				eastings: point.attr('E'),
				northings: point.attr('N'),
				url: url,
				name: point.attr('D')
			};
		}).toArray();
		
		var options = {
			pointsToLoad: points
		};

		var urlBase = 'https://tstibbs.github.io/geo-bagging/';
		$.getScript(urlBase + "js/loader.js").then(function() {
			loadApp(urlBase, function(main) {
				$('body').empty();//our map assumes it is full screen - there's probably a better way, but this will work for now
				main.loadMap(options);
			});
		});
	}
});
