//declare utility function outside of requirejs that will boot requirejs, so that we have minimal js in each html file
function loadOsMap(urlBase, callback) {
	window.os_map_base = urlBase;
	require([window.os_map_base + 'js/app.js'], function() {
		require(['main'], function(main) {
			if (typeof callback == 'string') {
				main[callback]({});
			} else {
				callback(main);
			}
		});
	});
}
