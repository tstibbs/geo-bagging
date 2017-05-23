define(['jquery', 'leaflet', '../constants'],
    function($, leaflet, constants) {
        var SourceView = leaflet.Class.extend({
			initialize: function(source, selectedSources) {
				var selected = selectedSources.indexOf(source) != -1;
				this.buildView(source, selected);
			},
			
			buildView: function(source, selected) {
				this._source = source;
				var label = $('<label></label>');
				this._input = $('<input></input>');
				this._input.attr('type', 'checkbox');
				this._input.attr('name', source);
				this._input.attr('value', source);
				if (selected) {
					this._input.attr('checked', 'true');
				}
				label.append(this._input);
				label.append(source);
				var wrapper = $('<div></div>');
				wrapper.append(label);
				this._view = wrapper;
				return wrapper;
			},
			
			render: function(parent) {
				parent.append(this._view);
			},
			
			getSelected: function() {
				if (this._input.is(':checked')) {
					return this._source;
				} else {
					return null;
				}
			}
		});
		SourceView.canDisplaySource = function(source) {
			return constants.dataSources.indexOf(source) != -1;
		};
		return SourceView;
    }
);
