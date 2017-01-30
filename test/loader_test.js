define(['loader'],
	function(loader) {
		QUnit.module('loader', function() {
			QUnit.test('check callback is called', function(assert) {
				var done = assert.async();

				if (window === undefined) {
					window = {};
				}
				window.os_map_base = "../";
				
				var oldRequire = window.require;
				window.require = function(module, callback){
					if (module[0].endsWith('js/app')) {
						callback();
					} else if (module[0] == 'main') {
						oldRequire(module, callback);
					} else {
						throw new Error('unrecognised module request in loader, this test needs updating: ' + module);
					}
				};
				
				loadOsMap([], function(main) {
					//just check that the thing we've been given is _actually_ the 'main' module
					assert.ok(main.buildMapWithBundleDatas !== undefined);
					window.require = oldRequire;
					done();
				});
			});
		});
	}
);
