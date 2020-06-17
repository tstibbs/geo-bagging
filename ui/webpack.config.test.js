const path = require('path')
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const base = require('./webpack.config.js');

module.exports = merge(base, {
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
        })
    ]
});
