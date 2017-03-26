define(['jquery', 'map_loader', 'constants', 'params'],
    function($, mapLoader, constants, params) {
        return function(config) {
			var datasources = constants.dataSources;
			var bundles = mapLoader.getBundleIds();
			var remoteData = params('remoteData') != null;
		
			var form = '';
            form += '<form action="#">';
			form += '    <fieldset>';
			form += '        <legend>Data sources</legend>';
			form += '    </fieldset>';
			form += '    <label><input type="checkbox" name="remoteData" value="remoteData">Remote data? (for developing on a mobile device)</label>';
			form += '    <br />';
			form += '    <input type="submit" value="Load map">';
			form += '</form>';
			
			var formElem = $(form);
			
			for (var i = 0; i < datasources.length; i++) {
				var source = datasources[i];
				var label = $('<label></label>');
				var input = $('<input></input>');
				input.attr('type', 'checkbox');
				input.attr('name', source);
				input.attr('value', source);
				if (bundles.indexOf(source) != -1) {
					input.attr('checked', 'true');
				}
				label.append(input);
				label.append(source);
				$('fieldset', formElem).append(label);
				$('fieldset', formElem).append($('<br />'));
			}

			if (remoteData) {
				$('input[name="remoteData"]', formElem).attr('checked', 'true');
			}
			
			$('body').append(formElem);
			
			formElem.submit(function(event) {
				event.preventDefault();
				var bundleIds = $.makeArray($('fieldset input:checked', this).map(function(index, input) {
					return $(input).attr('value');
				}));
				var remoteData = $('input[name="remoteData"]', this).is(':checked');
				mapLoader.loadMap({
					remoteData: remoteData
				}, bundleIds);
				return false;
			});
        };
    }
);
