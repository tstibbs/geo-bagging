define(['loader'],
	function(loader) {
		QUnit.module('loader', function() {
			QUnit.test('check callback is called', function(assert) {
				var done = assert.async();

				if (window === undefined) {
					window = {};
				}
				var urlBase = "../";
				
				var oldRequire = window.require;
				window.require = function(module, callback){
					if (module[0].endsWith('js/app.js')) {
						callback();
					} else if (module[0] == 'main') {
						oldRequire(module, callback);
					} else {
						throw new Error('unrecognised module request in loader, this test needs updating: ' + module);
					}
				};
				
				loadOsMap(urlBase, function(main) {
					//just check that the thing we've been given is _actually_ the 'main' module
					assert.ok(main.loadMap !== undefined);
					window.require = oldRequire;
					done();
				});
			});
		});
	}
);
