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
