import loader from '../src/js/loader';

let assert = eval('chai.assert')

describe('loader', function() {
    it('check callback is called', function() {
        var done = assert.async();

        if (window === undefined) {
            window = {};
        }
        var urlBase = "../";

        var oldRequire = window.require;

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
        window.require = function(module, callback) {
            if (endsWith(module[0], 'js/app.js')) {
                callback();
            } else if (module[0] == 'map_loader') {
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
