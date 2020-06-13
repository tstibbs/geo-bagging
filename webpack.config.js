const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    devServer: {
        contentBase: './dist'
    },
    entry: './js/app.js',
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'GeoBagging'
        })
    ]
}
