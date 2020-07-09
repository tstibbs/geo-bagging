let wslFlags = process.env.WSL_DISTRO_NAME != null ? ['--no-sandbox'] : []

module.exports = function (config) {
	config.set({
		frameworks: ['mocha'],

		files: [
			'dist/*.js'
		],

		browsers: ['Chrome_fixedSize'],

		customLaunchers: {
			'Chrome_fixedSize': {
				base: 'ChromeHeadless',
				flags: ['--window-size=1152,864', ...wslFlags]
			}
		}
	});
};
