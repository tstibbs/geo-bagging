import {readFileSync} from 'fs'
import {resolve} from 'path'
import {fileURLToPath} from 'url'

import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import {LicenseWebpackPlugin} from 'license-webpack-plugin'

import {defaultLicenseWebpackPluginConfig} from '@tstibbs/cloud-core-ui/build/licence-generation.js'
import {buildTemplateContentRenderingFunction} from '@tstibbs/cloud-core-ui/build/templates.js'

const isarrayLicenceText = readFileSync('./src/licences/isarray-LICENSE')
const mitLicenceText = readFileSync('./src/licences/MIT-License')
const fontAwesomeLicenceText = readFileSync('./src/licences/Font-Awesome-LICENSE.txt')
import {modulePrefixAliases, moduleAliases} from './project.config.js'

const projectName = `geo-bagging`
const bugReportUrl = `https://github.com/tstibbs/${projectName}/issues/new`

const defaultTemplateParameters = {
	projectName,
	bugReportUrl,
	logsEntriesIndicateErrors: true
}

const aliases = Object.fromEntries(
	Object.entries({...modulePrefixAliases, ...moduleAliases}).map(([module, alias]) => [module, resolve(alias)])
)

const resolveDependency = dep => fileURLToPath(import.meta.resolve(dep))

export default {
	mode: 'production',
	devtool: 'source-map',
	entry: {
		main: './src/js/entry/app.js',
		mini: './src/js/entry/mini.js'
	},
	output: {
		filename: '[name].[contenthash].js'
	},
	resolve: {
		alias: aliases,
		fallback: {
			stream: false,
			util: false
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'GeoBagging',
			templateContent: buildTemplateContentRenderingFunction('./src/templates/index.html.ejs', {
				...defaultTemplateParameters,
				baseUrl: undefined
			}),
			chunks: ['main']
		}),
		new HtmlWebpackPlugin({
			title: 'GeoBagging',
			filename: 'examples/mini.html',
			templateContent: buildTemplateContentRenderingFunction('./src/templates/index.html.ejs', {
				...defaultTemplateParameters,
				baseUrl: '../'
			}),
			chunks: ['mini']
		}),
		new webpack.ProvidePlugin({
			L: 'leaflet'
		}),
		new CopyPlugin({
			patterns: [
				{from: 'bundles/**/*.json', context: 'src/js'},
				{from: 'bundles/**/*.json.meta', context: 'src/js'},
				{from: 'bundles/**/*.geojson', context: 'src/js'},
				{from: 'bundles/**/*.geojson.meta', context: 'src/js'},
				{from: 'src/includes'}
			]
		}),
		new MiniCssExtractPlugin(),
		new LicenseWebpackPlugin({
			...defaultLicenseWebpackPluginConfig,
			excludedPackageTest: packageName => packageName === '@tstibbs/geo-bagging-shared',
			licenseFileOverrides: {
				'leaflet.markercluster': 'MIT-LICENCE.txt',
				'leaflet-mouse-position': 'MIT-LICENCE.txt'
			},
			licenseTextOverrides: {
				isarray: isarrayLicenceText,
				'assertion-error': mitLicenceText,
				'font-awesome': fontAwesomeLicenceText
			}
		})
	],
	optimization: {
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		splitChunks: {
			//maxSize: 500*1024,//breaks css ordering - see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/548
			chunks: 'all',
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		},
		minimizer: [new TerserPlugin(), new CssMinimizerPlugin({})]
	},
	module: {
		rules: [
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				type: 'asset'
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				type: 'asset/resource'
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader'
				]
			},
			{
				test: /\.(png|jpg|gif)$/i,
				type: 'asset/resource'
			},
			{
				test: resolveDependency('leaflet-mouse-position/src/L.Control.MousePosition.js'),
				use: 'exports-loader?exports=default|L.Control.MousePosition'
			},
			{
				test: resolveDependency('Leaflet.MapCenterCoord/src/L.Control.MapCenterCoord.js'),
				use: 'exports-loader?exports=default|L.Control.MapCenterCoord'
			},
			{
				test: resolveDependency('leaflet-control-hider/src/hider.js'),
				use: 'exports-loader?exports=default|L.Control.ControlHider'
			},
			{
				test: resolveDependency('leaflet-geosearch/src/js/l.control.geosearch.js'),
				use: 'exports-loader?exports=default|L.Control.GeoSearch'
			},
			{
				test: resolveDependency('sidebar-v2/js/leaflet-sidebar.js'),
				use: 'exports-loader?exports=default|L.Control.Sidebar'
			},
			{
				test: resolveDependency('leaflet.featuregroup.subgroup/dist/leaflet.featuregroup.subgroup-src.js'),
				use: 'exports-loader?type=commonjs&exports=single|L.FeatureGroup.SubGroup'
			}
		]
	}
}
