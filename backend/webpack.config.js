const {merge} = require('webpack-merge')
const WebpackShellPlugin = require('webpack-shell-plugin')

const {NODE_ENV: mode = 'production'} = process.env

let config = {
	mode: mode,
	devtool: 'inline-source-map',
	target: 'node',
	entry: './src/app.js',
	output: {
		libraryTarget: 'commonjs2'
	}
}

if (mode === 'development') {
	config = merge(config, {
		watch: true,
		plugins: [
			new WebpackShellPlugin({
				onBuildEnd: ['npm run dev:_serve']
			})
		]
	})
}

module.exports = config
