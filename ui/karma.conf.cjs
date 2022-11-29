//Note: this file is specifically a common-js file because karma doesn't support es6 config files: https://github.com/karma-runner/karma/issues/3677

const wsl = process.env.WSL_DISTRO_NAME != null

module.exports = function (config) {
	config.set({
		frameworks: ['mocha'],

		files: ['dist/*.js'],

		browsers: wsl ? ['ChromeHeadlessDocker'] : ['Chrome_fixedSize'],

		customLaunchers: {
			Chrome_fixedSize: {
				base: 'ChromeHeadless',
				flags: ['--window-size=1152,864']
			},
			ChromeHeadlessDocker: {
				base: 'Docker',
				modemOptions: {
					socketPath: '/var/run/docker.sock'
				},
				createOptions: {
					Image: 'alpeware/chrome-headless-trunk',
					Env: ['CHROME_OPTS=$KARMA_URL'],
					HostConfig: {
						NetworkMode: 'host'
					}
				}
			}
		}
	})
}
