define(['jquery', 'leaflet', '../constants'],
    function($, leaflet, constants) {
        var SourceView = leaflet.Class.extend({
			initialize: function(source) {
				this.buildView(source);
			},
			
			buildView: function(source) {
				this._source = source;
				this._input = $('<input></input>');
				this._input.attr('type', 'text');
				this._input.attr('name', source);
				this._input.attr('value', source);
				var wrapper = $('<div></div>');
				
				var dummyCheckbox = $('<input></input>');
				dummyCheckbox.attr('type', 'checkbox');
				dummyCheckbox.attr('checked', 'true');
				dummyCheckbox.attr('disabled', 'true');
				wrapper.append(dummyCheckbox);
				wrapper.append(this._input);
				this._view = wrapper;
			},
			
			render: function(parent) {
				parent.append(this._view);
			},
			
			getSelected: function() {
				return this._input.val();
			}
		});
		return SourceView;
    }
);
