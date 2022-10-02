import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet.js'
import Leaflet_MatrixLayers from 'VendorWrappers/leaflet-matrix-layers-control.js'
import Controls from './controls.js'
import layersBuilder from './layers.js'
import constants from './constants.js'
import params from './params.js'

//basic manager class that simplifies interoperation between other components
var Manager = leaflet.Class.extend({
	initialize: function (map, config) {
		this._authenticated = false //default
		var showUserSettings = params.test('testing') == 'true'
		if (showUserSettings) {
			this._initializePromise = $.Deferred(
				function (deferred) {
					$.get({
						url: constants.apiBackendBaseUrl + 'isAuthenticated',
						xhrFields: {
							withCredentials: true
						}
					})
						.then(
							function (data) {
								if (data == false) {
									this._authenticated = false
								} else {
									this._authenticated = true
									this._loggedInUser = data.email
								}
								deferred.resolve()
							}.bind(this)
						)
						.fail(
							function (xhr, textError, error) {
								if (xhr.status != 401) {
									//401 just means we're not logged in, it's not an error we need to report on
									console.error(
										'Failed to check authentication status - this can be ignored unless trying to record visits: ' +
											textError
									)
									console.log(error)
								}
								this._authenticated = false
								deferred.resolve()
							}.bind(this)
						)
				}.bind(this)
			).promise()
		} else {
			this._initializePromise = $.Deferred().resolve()
		}
		this._initializePromise = this._initializePromise.always(
			function () {
				this._map = map
				this._config = config
				this._layers = layersBuilder(map, config)
				if (this._config.dimensional_layering) {
					this._matrixLayerControl = new Leaflet_MatrixLayers(
						this._layers,
						null,
						{},
						{
							multiAspects: true,
							embeddable: this._config.use_sidebar
						}
					)
				}
				this._controls = new Controls(config, this._layers, map, this)
			}.bind(this)
		)
	},

	waitForInitialization: function () {
		return this._initializePromise
	},

	setViewConstraints: function (limitFunction) {
		this._limitFunction = limitFunction //function(latLng) {return true or false}
	},

	getViewConstraints: function () {
		return this._limitFunction
	},

	getControls: function () {
		return this._controls
	},

	getMap: function () {
		return this._map
	},

	getLayers: function () {
		return this._layers
	},

	getConfig: function () {
		return this._config
	},

	getMatrixLayerControl: function () {
		return this._matrixLayerControl
	},

	setAuthenticated: function (/*boolean*/ authenticated) {
		this._authenticated = authenticated
	},

	isAuthenticated: function () {
		return this._authenticated
	},

	shouldManageVisits: function () {
		//currently just checks that we're authenticated
		return this.isAuthenticated()
	},

	getLoggedInUser: function () {
		return this._loggedInUser
	}
})

export default Manager
