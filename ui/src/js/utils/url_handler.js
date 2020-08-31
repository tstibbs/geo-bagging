import leaflet from 'VendorWrappers/leaflet'
import params from '../params'

var UrlHandler = leaflet.Class.extend({
	initialize: function () {
		this._tester = new params.tester()
	},

	sourceLoaded: function (sourceName) {
		this._tester.update()
		var params = this._tester.getParams()
		var datasource = params['datasources']
		datasource = datasource == null ? '' : datasource
		delete params['datasources']
		datasource =
			datasource.length > 0 ? datasource + ',' + sourceName : sourceName
		var newParams = Object.keys(params)
			.map(function (paramKey) {
				return paramKey + '=' + params[paramKey]
			})
			.join('&')
		newParams =
			(newParams.length > 0 ? newParams + '&' : '') +
			'datasources=' +
			datasource
		var newUrl =
			document.location.origin + document.location.pathname + '?' + newParams
		//history.replaceState({}, "GeoBagging", newUrl);//do nothing for now until we come up with a nice way to make this bookmarkable
	}
})

export default UrlHandler
