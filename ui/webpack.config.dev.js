const {merge} = require('webpack-merge');

const base = require('./webpack.config.js');

module.exports = merge(base, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        writeToDisk: (filePath) => /\/bundles\//.test(filePath),
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    },
});
