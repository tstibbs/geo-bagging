import leaflet from 'VendorWrappers/leaflet'
import $ from 'jquery'
import constants from '../constants'

var AbstractBundleBuilder = leaflet.Class.extend({
	initialize: function (manager, bundleConfig, bundleName, urlPrefix) {
		this._markerList = null
		this._manager = manager
		this._config = manager.getConfig()
		this._bundleConfig = bundleConfig
		this._bundleName =
			bundleName.indexOf('/') == -1
				? bundleName
				: bundleName.substring(0, bundleName.lastIndexOf('/'))
		this._urlPrefix = urlPrefix != null ? urlPrefix : ''
		this._visits = []
	},

	_buildDataUrl: function () {
		return (
			this._urlPrefix +
			'bundles/' +
			this._bundleName +
			'/' +
			this._bundleConfig.dataToLoad
		)
	},

	_doFetchData: function () {
		var dataToLoad = this._buildDataUrl()
		var dataLoadPromise = $.ajax({
			url: dataToLoad,
			dataType: 'json'
		}).fail(function (xhr, textError, error) {
			console.error('Failed to load map data: ' + textError)
			console.log(error)
		})

		if (this._manager.shouldManageVisits()) {
			//not loading visits is ok, because we won't display the info either if not authenticated
			var visitsLoadPromise = $.get({
				url: constants.backendBaseUrl + 'listVisits?source=' + this._bundleName,
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				}
			})
				.then(
					function (data) {
						this._visits = data.map(
							function (visit) {
								//each visit file is named like "visits-hills-16495", so get everything after the second hyphen
								return visit.substring(
									visit.indexOf('-', visit.indexOf('-') + 1) + 1
								)
							}.bind(this)
						)
					}.bind(this)
				)
				.fail(function (xhr, textError, error) {
					console.error('Failed to load map data: ' + textError)
					console.log(error)
				})

			return $.when(dataLoadPromise, visitsLoadPromise).then(function (datas) {
				return datas[0] //only need to pass the actual data on, not the visits
			})
		} else {
			return dataLoadPromise
		}
	},

	fetchMeta: function () {
		var dataToLoad = this._buildDataUrl() + '.meta'
		return $.ajax({
			url: dataToLoad,
			dataType: 'json'
		})
			.fail(function (xhr, textError, error) {
				console.error('Failed to load source metadata: ' + textError)
				console.log(error)
			})
			.done(
				function (data) {
					this._meta = data
				}.bind(this)
			)
	},

	getMeta: function () {
		return this._meta
	},

	getVisits: function () {
		return this._visits
	},

	getBundleConfig: function () {
		return this._bundleConfig
	}
})

export default AbstractBundleBuilder
