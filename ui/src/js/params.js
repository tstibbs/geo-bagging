import global from './global';
import leaflet from 'VendorWrappers/leaflet';

var ParamChecker = leaflet.Class.extend({
	initialize: function () {
		this.update();
	},
	
	update: function() {
		this._params = {};
		var search = global.location.search;
		if (search.length > 0) {
			search = search.substr(1);
			var paramString = search.split("&");
			paramString.forEach(function (item) {
				var tmp = item.split("=");
				this._params[tmp[0]] = decodeURIComponent(tmp[1]);
			}.bind(this));
		}
	},
	
	getParams: function() {
		return this._params;
	},

	test: function(key) {
		return this._params[key];
	}
});

var defaultInstance = new ParamChecker();
export default {
	//bit dirty, but 'test' function makes it easy to check params, while the 'tester' gives you a class you can instantiate to check stuff at the relevant time.
	test: function(key) {
		return defaultInstance.test(key);
	},
	tester: ParamChecker
}
