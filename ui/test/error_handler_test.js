define(['jquery'],
	function($) {
		QUnit.module('error_handler', function() {
		
			function runTest(assert, caller, expected) {
				//set up
				var $container = $('<div id="error-container"></div>');
				$container.append($('<div id="errors-list"></div>'));
				$container.append($('<a id="dismiss-button" href="#"></a>'));
				$('#qunit-fixture').append($container);
				var done = assert.async();
				require(['error_handler'], function(error_handler) {
					//setup
					addErrorHandler();//the dom is _never_ ready in qunit, so poke the error handler manually
					//run test
					caller();
					//verify
					assert.equal($container.text(), expected);
					done();
				});
			}
		
			QUnit.test('console.log', function(assert) {
				runTest(assert, function () {
					console.log('blah');
				}, 'blah');
			});
			QUnit.test('console.log - multi args', function(assert) {
				runTest(assert, function () {
					console.log('blah', 'thing', 124, 'stuff');
				}, 'blah | thing | 124 | stuff');
			});
			QUnit.test('console.error', function(assert) {
				runTest(assert, function () {
					console.error('blah');
				}, 'blah');
			});
			QUnit.test('console.warn', function(assert) {
				runTest(assert, function () {
					console.warn('blah');
				}, 'blah');
			});
			QUnit.test('window.onerror', function(assert) {
				runTest(assert, function () {
					//can't just throw an error here as that would break the unit test itself.
					window.onerror('blah', 'thingf', 0, 0, 'stuffe');
				}, 'blah | thingf | stuffe');
			});
			QUnit.test('hide errors', function(assert) {
				//set up
				var $container = $('<div id="error-container"></div>');
				$container.append($('<a id="dismiss-button" href="#"></a>'));
				$('#qunit-fixture').append($container);
				var done = assert.async();
				require(['error_handler'], function(error_handler) {
					//setup
					addErrorHandler();//the dom is _never_ ready in qunit, so poke the error handler manually
					//run test
					assert.ok($('#error-container').is(':visible'));
					$('#dismiss-button').trigger("click");
					//verify
					assert.notOk($('#error-container').is(':visible'));
					done();
				});
			});
		});
	}
);
