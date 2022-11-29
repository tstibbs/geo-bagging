//Note: this file is specifically a common-js file because karma doesn't support es6 config files: https://github.com/karma-runner/karma/issues/3677

var baseConfig = require('./karma.conf.js')

//browser
const base = {base: 'SauceLabs'}
const chrome = {...base, browserName: 'chrome', version: '71'}
const firefox = {...base, browserName: 'firefox', version: '64'}
const ie = {...base, browserName: 'internet explorer', version: '11'}
const edge = {...base, browserName: 'MicrosoftEdge', version: '18'}
//OS
const win7 = {platform: 'Windows 7'}
const win10 = {platform: 'Windows 10'}
const linux = {platform: 'Linux'}
const osx = {platform: 'OS X 10.11'}

var browsers = {
	sl_chrome_win10: {...chrome, ...win10},
	sl_chrome_win7: {...chrome, ...win7},
	sl_firefox_win10: {...firefox, ...win10},
	sl_edge_win10: {...edge, ...win10},
	sl_ie_win7: {...ie, ...win7}
}

var extraBrowsers = {
	sl_firefox_win7: {...firefox, ...win7},
	sl_ie_win10: {...ie, ...win10},
	sl_chrome_linux: {...chrome, ...linux, version: '48'}, //linux doesn't have the most recent chrome
	sl_chrome_osx: {...chrome, ...osx}
	//sl_safari_win7: //something odd happens in the tests which is probably impossible to diagnose without access to a safari instance
	//sl_safari_osx: //something odd happens in the tests which is probably impossible to diagnose without access to a safari instance
	//sl_opera: //there is a problem with opera causing requirejs to time out, so commenting out until I have chance to look into it further
}

var mobileBrowsers = {
	sl_iphone6: {
		browserName: 'Safari',
		deviceName: 'iPhone 6 Simulator',
		deviceOrientation: 'portrait',
		platformVersion: '9.3',
		platformName: 'iOS'
	},
	sl_iphone4s: {
		browserName: 'Safari',
		deviceName: 'iPhone 4s Simulator',
		deviceOrientation: 'portrait',
		platformVersion: '9.3',
		platformName: 'iOS'
	},
	sl_ipad: {
		browserName: 'Safari',
		deviceName: 'iPad Simulator',
		deviceOrientation: 'portrait',
		platformVersion: '9.3',
		platformName: 'iOS'
	},
	sl_s4: {
		browserName: 'Browser',
		deviceName: 'Samsung Galaxy S4 Emulator',
		deviceOrientation: 'portrait',
		platformVersion: '4.4',
		platformName: 'Android'
	},
	sl_android51: {
		browserName: 'Browser',
		deviceName: 'Android Emulator',
		deviceType: 'tablet',
		deviceOrientation: 'portrait',
		platformVersion: '5.1',
		platformName: 'Android'
	}
}

//if doing an extended test
browsers = {...browsers, ...extraBrowsers}
//if doing a mobile test
//browsers = { ...browsers, ...mobileBrowsers}

module.exports = function (config) {
	baseConfig(config)
	config.set({
		reporters: ['saucelabs', 'spec'],

		preprocessors: {},

		sauceLabs: {
			public: 'public'
		},

		browsers: Object.keys(browsers),

		customLaunchers: browsers,

		concurrency: 1,

		browserNoActivityTimeout: 60000,
		browserDisconnectTimeout: 10000,
		captureTimeout: 60000
	})
}
