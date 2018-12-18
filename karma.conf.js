// Karma configuration

module.exports = function(config) {
  config.set({
	frameworks: ['requirejs', 'qunit'],

	files: [
		'js/app.js',
		'test/qunit_suite/suite.js',
		{pattern: 'js/**/*.js', included: false},
		{pattern: 'test/**/*.js', included: false},
	],

	reporters: ['spec', 'coverage'],

	preprocessors: { 'js/**/*.js': ['coverage'] },
	
	coverageReporter: {
		type : 'lcov',
		subdir: 'karma'
	},

	browsers: ['Chrome_fixedSize'],
	
	customLaunchers: {
      'Chrome_fixedSize': {
        base: 'ChromeHeadless',
        flags: ['--window-size=1152,864']
      }
    }
  });
};
