const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    devServer: {
        contentBase: './dist',
        writeToDisk: true
    },
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            VendorWrappers: path.resolve(__dirname, 'src/js/vendor-wrappers'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'GeoBagging',
        }),
        new webpack.ProvidePlugin({
            'L': 'leaflet',
        }),
        new CopyPlugin({
            patterns: [
                { from: 'bundles/**/*.json', context: 'src/js'},
                { from: 'bundles/**/*.json.meta', context: 'src/js'},
                { from: 'bundles/**/*.geojson', context: 'src/js'},
                { from: 'bundles/**/*.geojson.meta', context: 'src/js'}
            ]
        })
    ],
    module: {
        rules: [
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: require.resolve('./node_modules/leaflet-plugins/layer/tile/Bing.js'),
                use: 'exports-loader?BingLayer=L.BingLayer',
            },
            {
                test: require.resolve('./node_modules/leaflet-mouse-position/src/L.Control.MousePosition.js'),
                use: 'exports-loader?MousePosition=L.Control.MousePosition',
            },
             
            {
                test: require.resolve('./node_modules/leaflet-map-center-coord/src/L.Control.MapCenterCoord.js'),
                use: 'exports-loader?MapCenterCoord=L.Control.MapCenterCoord',
            },
            {
                test: require.resolve('./node_modules/leaflet-control-hider/src/hider.js'),
                use: 'exports-loader?ControlHider=L.Control.ControlHider',
            },
            {
                test: require.resolve('./node_modules/leaflet-geosearch/src/js/l.control.geosearch.js'),
                use: 'exports-loader?GeoSearch=L.Control.GeoSearch',
            },
            {
                test: require.resolve('./node_modules/leaflet-geosearch/src/js/l.geosearch.provider.bing.js'),
                use: 'exports-loader?GeoSearchBing=L.GeoSearch.Provider.Bing',
            },
            {
                test: require.resolve('./node_modules/sidebar-v2/js/leaflet-sidebar.js'),
                use: 'exports-loader?Sidebar=L.Control.Sidebar',
            },
            {
                test: require.resolve('./node_modules/leaflet.featuregroup.subgroup/dist/leaflet.featuregroup.subgroup.js'),
                use: 'exports-loader?SubGroup=L.FeatureGroup.SubGroup',
            }
        ]
    }
}
