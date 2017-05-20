define(['leaflet'],
	function(leaflet) {
		return leaflet.Control.Attribution.extend({
			addDataSourceAttribution: function (text) {
				if (!this._dataSourceAttributions) {
					this._dataSourceAttributions = [];
				}
				this._dataSourceAttributions.push(text);
				this._update();
			},
			
			_update: function () {
				leaflet.Control.Attribution.prototype._update.call(this);
				
				if (!this._map) { return; }

				if (this._dataSourceAttributions != null && this._dataSourceAttributions.length > 0) {
					var newHtml = [this._container.innerHTML];
					for (var i = 0; i < this._dataSourceAttributions.length; i++) {
						newHtml.push(this._dataSourceAttributions[i]);	
					}
					this._container.innerHTML = newHtml.join('<br />');
				}
			}
		});
	}
);
