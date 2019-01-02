//$.getScript("https://tstibbs.github.io/geo-bagging/integration/trigpointing.js");

var urlBase = 'https://tstibbs.github.io/geo-bagging/';

$.getScript(urlBase + "js/loader.js").then(function() {
	loadApp(urlBase, function() {
		require(['integration/tuk'], function(tukIntegration) {
			tukIntegration.showMap();
		});
	});
});
