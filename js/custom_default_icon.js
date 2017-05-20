define(["leaflet"],
	function(leaflet) {
		return leaflet.Icon.Default.extend({
			initialize: function (customIconPath, options) {
				this._customIconPath = customIconPath;
				leaflet.Icon.Default.prototype.initialize.call(this, options);
			},

			_getIconUrl: function(name) {
				var url = leaflet.Icon.prototype._getIconUrl.call(this, name);
				if (url == this._customIconPath) {
					return url;
				} else {
					return leaflet.Icon.Default.prototype._getIconUrl.call(this, name);
				}
			}
		});
	}
);
