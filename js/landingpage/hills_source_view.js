define(['jquery', 'leaflet', './source_view'],
    function($, leaflet, SourceView) {
		var sourceName = 'hills';
		var extraSourceName = 'hills/config_all';
        var SourceView = SourceView.extend({
			initialize: function(source, selectedSources) {
				var extraSelected = selectedSources.indexOf(extraSourceName) != -1;
				var sourceSelected = extraSelected || selectedSources.indexOf(sourceName) != -1;
				
				var wrapper = this.buildView(sourceName, sourceSelected);
				var extraLabel = $('<label></label>');
				var extraInput = $('<input></input>');
				extraInput.attr('type', 'checkbox');
				extraInput.attr('name', extraSourceName);
				extraInput.attr('value', extraSourceName);
				if (extraSelected) {
					extraInput.attr('checked', 'true');
				}
				extraInput.prop("disabled", !sourceSelected);
				extraLabel.append(extraInput);
				extraLabel.append('<span>Include <i>all</i> hills? (including minor, subs, deletions etc)</span>');
				wrapper.append(extraLabel);
				this._extraInput = extraInput;
				
				this._input.click(function() {
					var selected = $(this).is(':checked');
					extraInput.prop("disabled", !selected);
				});
				
				this._view = wrapper;
			},
			
			render: function(parent) {
				parent.append(this._view);
			},
			
			getSelected: function() {
				if (this._input.is(':checked')) {
					if (this._extraInput.is(':checked')) {
						return extraSourceName;
					} else {
						return sourceName;
					}
				} else {
					return null;
				}
			}
		});
		SourceView.canDisplaySource = function(source) {
			return source == sourceName || source == extraSourceName;
		};
		return SourceView;
    }
);
