//declare utility function outside of requirejs that will boot requirejs, so that we have minimal js in each html file
function loadOsMap(urlBase, callback) {
	window.os_map_base = urlBase;
	require([window.os_map_base + 'js/app.js'], function() {
		require(['map_loader'], function(mapLoader) {
			if (typeof callback == 'string') {
				mapLoader[callback]({});
			} else {
				callback(mapLoader);
			}
		});
	});
}

function loadApp(urlBase, callback) {
	$.ajaxSetup({
	  cache: true
	});
	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.js").then(function() {
		loadOsMap(urlBase, callback);
	});
}
