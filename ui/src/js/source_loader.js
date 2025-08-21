import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet.js'
import constants from './constants.js'
import ModelViews from './model_views.js'
import params from './params.js'

const IGNORED_SOURCE_IDS = [
	//we used to have the hills source split in two - one reduced data set (which was the default) and one full dataset (the source id referenced below). The default is now the full dataset and we don't maintain the reduced set. Anyone with the 'all' source id in their bookmarks would see an error - so we just ignore it here.
	'hills/config_all'
]

var SourceLoader = leaflet.Class.extend({
	initialize: function (manager, config) {
		this._manager = manager
		this._config = config
	},

	_parseSources: function (paramName) {
		var sourcesString = params.test(paramName)
		return sourcesString != null && sourcesString.length > 0 ? sourcesString.split(',') : []
	},

	loadSources: function (selectedSourceIds) {
		var extraDataSources = this._parseSources('extra-datasources')
		extraDataSources = extraDataSources.filter(source => !IGNORED_SOURCE_IDS.includes(source))
		var sourceIds = $.uniqueSort(selectedSourceIds.concat(constants.dataSources, extraDataSources))
		var sourceModuleIds = this._sourceIdsToDataSources(sourceIds)
		var deferredObject = $.Deferred()
		var sources = {}
		let promises = sourceModuleIds.map(source => import('./bundles/' + source + '.js'))
		Promise.all(promises).then(modules => {
			modules.forEach((sourceModule, i) => {
				sourceModule = sourceModule.default
				if (typeof sourceModule == 'function') {
					sourceModule = sourceModule(this._config)
				}
				sources[sourceModuleIds[i]] = sourceModule
			})

			var sourceModels = {}
			var lazyModels = {}
			var promises = Object.keys(sources).map(
				function (sourceName) {
					var source = sources[sourceName]
					var parser = new source.parser(this._manager, source, sourceName)

					var metaPromise = parser.fetchMeta()
					if (selectedSourceIds.indexOf(sourceName) != -1) {
						var dataPromise = parser.fetchData()
						sourceModels[sourceName] = parser
						return $.when(metaPromise, dataPromise)
					} else {
						lazyModels[sourceName] = parser
						return metaPromise
					}
				}.bind(this)
			)

			$.when.apply($, promises).always(
				function () {
					this._modelViews = new ModelViews(sources, this._manager)
					this._modelViews.loadModelViews(sourceModels, lazyModels, this._config, this._finish.bind(this))
					//don't need to wait for ModelViews to finish, callback will update UI when the time comes, but can safely return after this call
					deferredObject.resolve()
				}.bind(this)
			)

			setTimeout(() => {
				deferredObject.resolve()
			}, 1)
		})
		return deferredObject.promise() //TODO if one of the bundles is missing, we error, but the error is hidden...
	},

	_sourceIdsToDataSources: function (allSources) {
		if (allSources != null) {
			allSources = allSources.map(function (source) {
				if (source.indexOf('/') == -1) {
					return source + '/config'
				} else {
					return source
				}
			})
		} else {
			allSources = []
		}
		return allSources
	},

	_autoLoadSources: async function () {
		let sourceIds = this._parseSources('auto-load-datasources')
		let dataSources = this._sourceIdsToDataSources(sourceIds)
		let promises = dataSources.map(sourceId => this._modelViews.loadSource(sourceId))
		await Promise.all(promises)
	},

	_finish: async function () {
		await this._autoLoadSources()
		$('div#loading-message-pane').hide()
	}
})

export default SourceLoader
