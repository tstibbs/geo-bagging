function showError(errorMessage) {
    alert(errorMessage)
}
var unsupportedFeatures = []

function test(script, name) {
	try {
		eval(script)
	} catch (err) {
		unsupportedFeatures.push(name)
		console.error(err)
	}
}

test("let val = 'a'", 'let')
test("const arr = 'a'", 'const')
test('var str = `abc`', 'backticks')
test("'a'.includes('b')", 'String.prototype.includes')
test("['a'].includes('b')", 'Array.prototype.includes')
test("['a'].map(elem => elem + 'b')", 'arrow functions')
test("document.createElement('div').remove()", 'ChildNode.remove')
test('var a = document.currentScript.src', 'document.currentScript')

if (unsupportedFeatures.length > 0) {
	var errorMessage =
		'Browser does not support some features required by geo-bagging (' +
		unsupportedFeatures.join(', ') +
		'), please either use a more modern browser (ideally Chrome) or report a bug at https://github.com/tstibbs/geo-bagging/issues/new.'
	try {
		console.log(errorMessage)
		console.log(typeof showError)
		if (typeof showError === 'function') {
			showError(errorMessage)
		}
		document.execCommand('Stop')
	} catch (err) {
		console.error(err)
		//catch but just log so we can continue to try to throw the more helpful error message
	}
	throw Error(errorMessage)
}


window.geoBaggingBaseUrl = /^(.*)\/integration\/trigpointing\.js.*$/.exec(document.currentScript.src)[1] + '/';
var defaultOptions = {
    dataType: "script",
    cache: true
};
$("head").append('<link rel="stylesheet" type="text/css" href="' + window.geoBaggingBaseUrl + 'vendors.css">');
$("head").append('<link rel="stylesheet" type="text/css" href="' + window.geoBaggingBaseUrl + 'integration~main~mini.css">');

$.ajax($.extend({url: window.geoBaggingBaseUrl + "runtime.3e4eac708457a510b164.js"}, defaultOptions));
$.ajax($.extend({url: window.geoBaggingBaseUrl + "vendors.276a02870dea2451e0a0.js"}, defaultOptions));
$.ajax($.extend({url: window.geoBaggingBaseUrl + "integration~main~mini.04e1e2f8bf04c8d6f3da.js"}, defaultOptions));
$.ajax($.extend({url: window.geoBaggingBaseUrl + "integration.991ec9cc2d1a04397f3e.js"}, defaultOptions));

