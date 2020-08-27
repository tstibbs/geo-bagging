function showError(errorMessage) {
    alert(errorMessage)
}
var unsupportedFeatures = [];

function test(script, name) {
    try {
        eval(script);
    } catch (err) {
        unsupportedFeatures.push(name);
        console.error(err);
    }
}

test("let val = 'a'", 'let');
test("const arr = 'a'", 'const');
test("var str = `abc`", 'backticks');
test("'a'.includes('b')", 'String.prototype.includes');
test("['a'].includes('b')", 'Array.prototype.includes');
test("['a'].map(elem => elem + 'b')", 'arrow functions');
test("document.createElement('div').remove()", 'ChildNode.remove');
test("var a = document.currentScript.src", 'document.currentScript')

if (unsupportedFeatures.length > 0) {
    var errorMessage = "Browser does not support some features required by geo-bagging (" + unsupportedFeatures.join(', ') + "), please either use a more modern browser (ideally Chrome) or report a bug at https://github.com/tstibbs/geo-bagging/issues/new.";
    try {
        console.log(errorMessage);
        console.log(typeof showError);
        if (typeof showError === 'function') {
            showError(errorMessage);
        }
        document.execCommand('Stop');
    } catch (err) {
        console.error(err);
        //catch but just log so we can continue to try to throw the more helpful error message
    }
    throw Error(errorMessage);
}


window.geoBaggingBaseUrl = /^(.*)\/integration\/trigpointing\.js.*$/.exec(document.currentScript.src)[1] + '/';
var defaultOptions = {
    dataType: "script",
    cache: true
};
$("head").append('<link rel="stylesheet" type="text/css" href="' + window.geoBaggingBaseUrl + 'vendors.css">');
$("head").append('<link rel="stylesheet" type="text/css" href="' + window.geoBaggingBaseUrl + 'integration~main~mini.css">');

$.ajax($.extend({url: window.geoBaggingBaseUrl + "runtime.b4b924df7bb9d7a8d80b.js"}, defaultOptions));
$.ajax($.extend({url: window.geoBaggingBaseUrl + "vendors.e97cce86d1dbe52a7e53.js"}, defaultOptions));
$.ajax($.extend({url: window.geoBaggingBaseUrl + "integration~main~mini.1c92403850335563a8e5.js"}, defaultOptions));
$.ajax($.extend({url: window.geoBaggingBaseUrl + "integration.d2c5f7e0d0babd45718d.js"}, defaultOptions));

