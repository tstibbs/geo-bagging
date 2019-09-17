define([
	'jquery',
	'leaflet',
	'constants',
	'model_views',
	'params'
],
	function(
		$,
		leaflet,
		constants,
		ModelViews,
		params
	) {
	
		var SourceLoader = leaflet.Class.extend({
			initialize: function (manager, config) {
				this._manager = manager;
				this._config = config;
			},
			
			loadSources: function(selectedSourceIds) {
				var extraDataSourcesString = params.test('extra-datasources');
				var extraDataSources = (extraDataSourcesString != null && extraDataSourcesString.length > 0) ? extraDataSourcesString.split(',') : [];
				var sourceIds = $.uniqueSort(selectedSourceIds.concat(constants.dataSources, extraDataSources));
				var sourceModuleIds = this._sourceIdsToDataSources(sourceIds);
				sourceModuleIds = sourceModuleIds.map(function(sourceId){
					return 'bundles/' + sourceId;
				});
				var deferredObject = $.Deferred();
				require(sourceModuleIds, function(/*sources...*/) {
					var sources = {};
					for (var i = 0; i < arguments.length; i++) {
						sources[sourceIds[i]] = arguments[i];
					}
				
					//https://cdn.jsdelivr.net/gh/tstibbs/geo-bagging@gh-pages/js/bundles/nt/data.json
					var sourceDataPrefix = (this._config.remoteData ? 'https://cdn.jsdelivr.net/gh/tstibbs/geo-bagging@gh-pages' : window.os_map_base);//some mobile browsers don't support local ajax, so this provides a workaround for dev on mobile devices.
					
					var sourceModels = {};
					var lazyModels = {};
					var promises = Object.keys(sources).map(function(sourceName) {
						var source = sources[sourceName];
						var parser = new source.parser(this._manager, source, sourceName, sourceDataPrefix);
						
						var metaPromise = parser.fetchMeta();
						if (selectedSourceIds.indexOf(sourceName) != -1) {
							var dataPromise = parser.fetchData();
							sourceModels[sourceName] = parser;
							return $.when(metaPromise, dataPromise);
						} else {
							lazyModels[sourceName] = parser;
							return metaPromise;
						}
					}.bind(this));
					
					$.when.apply($, promises).always(function() {
						var modelViews = new ModelViews(sources, this._manager);
						modelViews.loadModelViews(sourceModels, lazyModels, this._config, this._finish);
						//don't need to wait for ModelViews to finish, callback will update UI when the time comes, but can safely return after this call
						deferredObject.resolve();
					}.bind(this));
				}.bind(this));
				return deferredObject.promise();
			},
			
			_sourceIdsToDataSources: function(allSources) {
				if (allSources != null) {
					allSources = allSources.map(function(source) {
						if (source.indexOf('/') == -1) {
							return source + '/config';
						} else {
							return source;
						}
					});
				} else {
					allSources = [];
				}
				return allSources;
			},
			
			_finish: function() {
				$('div#loading-message-pane').hide();
			}
		});

		return SourceLoader;
	}
);
