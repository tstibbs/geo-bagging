import {merge} from 'webpack-merge'

import base from './webpack.config.js'

export default merge(base, {
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
