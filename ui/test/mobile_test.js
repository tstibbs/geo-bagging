import Squire from 'Squire';
import mobile from '../src/js/mobile';

let assert = eval('chai.assert')

describe('mobile', function() {
    //NOTE: some of these user agents might be munged slightly due to the author's paranoia.

    it('mobile device', function() {
        // chrome on android
        runTest(assert, Squire, "Mozilla/5.0 (Linux; Android 5.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.0000.00 Mobile Safari/537.36", true);
        // firefox on android
        runTest(assert, Squire, "Mozilla/5.0 (Android 5.0.1; Mobile; rv:48.0) Gecko/48.0 Firefox/48.0", true);
        // android browser
        runTest(assert, Squire, "Mozilla/5.0 (Linux; Android 5.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.0000.00 Mobile Safari/537.36", true);
        // safari on ios
        runTest(assert, Squire, "Mozilla/5.0 (iPhone; CPU iPhone OS 6_2_1 like Mac OS X) AppleWebKit/000.0.00 (KHTML, like Gecko) Version/9.0 Mobile/12h64 Safari/600.0", true);
    });

    it('mobile pretending to be a desktop', function() {
        // chrome on android
        runTest(assert, Squire, "Mozilla/5.0 (X11; Linux x86_64) AppletWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.0000.00 Safari/537.36", false);
        // firefox on android
        runTest(assert, Squire, "Mozilla/5.0 (X11; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0", false);
        // android browser
        runTest(assert, Squire, "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.0000.00 Safari/537.36", false);
    });

    it('desktop', function() {
        // chrome on a desktop
        runTest(assert, Squire, "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.0000.00 Safari/537.36", false);
        // firefox on a desktop
        runTest(assert, Squire, "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0", false);
        // IE on a desktop
        runTest(assert, Squire, "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko", false);
    });
});

function runTest(assert, Squire, userAgent, expected) {
    var done = assert.async();
    var injector = new Squire();
    var mockWindow = {};
    mockWindow.navigator = {};
    mockWindow.navigator.userAgent = userAgent;
    mockWindow.location = {};
    mockWindow.location.search = "";
    injector.mock('global', mockWindow);
    injector.require(['mobile'], function(mobile) {
        assert.equal(expected, mobile.isMobile(), "Expected: " + expected + " for user agent: " + userAgent);
        done();
    });
}
