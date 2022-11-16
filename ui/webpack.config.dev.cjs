const {merge} = require('webpack-merge')

const base = require('./webpack.config.cjs')

module.exports = merge(base, {
	mode: 'development',
	devtool: 'inline-cheap-module-source-map',
	devServer: {
		port: 3000,
		devMiddleware: {
			writeToDisk: filePath => /(\/bundles\/|licenses.txt)/.test(filePath)
		},
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	}
})
