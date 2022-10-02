import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet.js'
import constants from './constants.js'
import ModelViews from './model_views.js'
import params from './params.js'

var SourceLoader = leaflet.Class.extend({
	initialize: function (manager, config) {
		this._manager = manager
		this._config = config
	},

	loadSources: function (selectedSourceIds) {
		var extraDataSourcesString = params.test('extra-datasources')
		var extraDataSources =
			extraDataSourcesString != null && extraDataSourcesString.length > 0 ? extraDataSourcesString.split(',') : []
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
					var modelViews = new ModelViews(sources, this._manager)
					modelViews.loadModelViews(sourceModels, lazyModels, this._config, this._finish)
					//don't need to wait for ModelViews to finish, callback will update UI when the time comes, but can safely return after this call
					deferredObject.resolve()
				}.bind(this)
			)

			setTimeout(() => {
				this._finish()
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

	_finish: function () {
		$('div#loading-message-pane').hide()
	}
})

export default SourceLoader
