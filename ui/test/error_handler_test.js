import $ from 'jquery'

import {Sidebar as addErrorHandler} from 'exports-loader?Sidebar=addErrorHandler!../src/js/error_handler'

let assert = eval('chai.assert')

describe('error_handler', function() {

	function runTest(done, caller, expected) {
		//set up
		var $container = $('<div id="error-container"></div>');
		$container.append($('<div id="errors-list"></div>'));
		$container.append($('<a id="dismiss-button" href="#"></a>'));
		$('#test-fixture').append($container);
		//setup
		addErrorHandler();//the dom is _never_ ready in qunit, so poke the error handler manually
		//run test
		caller();
		//verify
		assert.equal($container.text(), expected);
		done();
	}

	it('console.log', function(done) {
		runTest(done, function () {
			console.log('blah');
		}, 'blah');
	});
	it('console.log - multi args', function(done) {
		runTest(done, function () {
			console.log('blah', 'thing', 124, 'stuff');
		}, 'blah | thing | 124 | stuff');
	});
	it('console.error', function(done) {
		runTest(done, function () {
			console.error('blah');
		}, 'blah');
	});
	it('console.warn', function(done) {
		runTest(done, function () {
			console.warn('blah');
		}, 'blah');
	});
	it('window.onerror', function(done) {
		runTest(done, function () {
			//can't just throw an error here as that would break the unit test itself.
			window.onerror('blah', 'thingf', 0, 0, 'stuffe');
		}, 'blah | thingf | stuffe');
	});
	it('hide errors', function() {
		//set up
		var $container = $('<div id="error-container"></div>');
		$container.append($('<a id="dismiss-button" href="#"></a>'));
		$('#test-fixture').append($container);
		//setup
		addErrorHandler();//the dom is _never_ ready in qunit, so poke the error handler manually
		//run test
		assert.ok($('#error-container').is(':visible'));
		$('#dismiss-button').trigger("click");
		//verify
		assert.notOk($('#error-container').is(':visible'));
	});
});
