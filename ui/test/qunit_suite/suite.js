//list of tests
var testFiles = [
	"mouseposition_osgb_test.js",
	"screenposition_osgb_test.js",
	"points_view_test.js",
	"conversion_test.js",
	"mobile_test.js",
	"params_test.js",
	"config_test.js",
	"map_view_test.js",
	"loader_test.js",
	"error_handler_test.js",
	"controls_test.js",
	"layers_test.js",
	"fullscreen_link_test.js"
];

//these extras are a hack for testing, so no need for them to appear in app.js
testingPaths.loader = '../js/loader';
testingPaths.error_handler = '../js/error_handler';

requirejs.config({
	paths: testingPaths,
	shim: {
		sinon: {
			exports: 'sinon'
		},
		loader: {
			exports: 'loadOsMap'
		}
	}
});

if (window.__karma__ == undefined) {
	//we've just opened a qunit page locally for dev purposes
	setupNonKarma();
} else {
	//we're running karma as part of the build
	setupKarma();
}

function setupNonKarma() {
	QUnit.config.autostart = false;

	var tests = testFiles.map(function (testFile) { 
		return '../' + testFile;
	})

	// Resolve all testModules and then start the Test Runner.
	requirejs(tests, function(){
		QUnit.load();
		QUnit.start();
	});
}

function setupKarma() {

	//hacking in some stuff that would be useful in phantom js
	if (String.prototype.endsWith === undefined) {
		String.prototype.endsWith = function(suffix) {
			return this.indexOf(suffix, this.length - suffix.length) !== -1;
		};
	}

	var tests = testFiles.map(function (testFile) { 
		return '/base/test/' + testFile;
	});

	requirejs.config({
		baseUrl: '/base/js',

		//load our tests
		deps: tests,

		//kick off tests only once requirejs has finished, but only once
		callback: function() {
			if (window.KARMA_TESTS_STARTED === true) {
				return;
			} else {
				window.KARMA_TESTS_STARTED = true;
				window.__karma__.start();
			}
		}
	});
}
