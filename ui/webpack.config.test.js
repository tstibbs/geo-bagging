const path = require('path')
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

const base = require('./webpack.config.js');

module.exports = merge(base, {
    devServer: {
        writeToDisk: (filePath) => base.devServer.writeToDisk(filePath) || /\/mocha.(js|css)$/.test(filePath)
    },
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        test: path.resolve(__dirname, "test/suite/suite.js")
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'test.html',
            inject: false,
            template: "test/suite/test.html",
            chunks: ['test']
        }),
        new CopyPlugin({
            patterns: [
                { from: 'mocha.js', context: './node_modules/mocha/'},
                { from: 'mocha.css', context: './node_modules/mocha/'},
            ]
        })
    ]
});
