define(['jquery'],
	function($) {
		//creates the html we need to display errors, loading screen and the map container
		return function(config) {
			var content = '';
			
			var mapClass = '';
			if (config.map_style == 'mini' || config.map_style == 'mini_embedded') {
				mapClass = ' class="mini-map"';
			} else if (config.map_style == 'full') {
				mapClass = ' class="full-screen"';
			} else if (config.map_style == 'embedded') {
				mapClass = ' class="embedded-map"';
			}

			content+= 	'<div id="error-container" style="display: none;">';
			content+= 		'<p class="title">Some errors have occurred:</p>';
			content+= 		'<div id="errors-list"></div>';
			content+= 		'<a id="dismiss-button" href="#">Hide</a>';
			content+= 	'</div>';
			if (config.map_style == 'mini' || config.map_style == 'mini_embedded') {
				content+= 	'<div class="mini-map">';
			}
			content+= 		'<div id="loading-message-pane" class="full-screen">';
			content+= 			'<div class="loading-message-container">';
			content+= 				'<div class="loading-message-text">';
			content+= 					'<p>Loading...</p>';
			content+= 				'</div>';
			content+= 			'</div>';
			content+= 		'</div>';
			content+= 		'<div id="' + config.map_element_id + '"' + mapClass + '></div>';
			if (config.map_style == 'mini') {
				content+= 	'</div>';
				content+= 	'<div class="full-screen-link"></div>';
			}

			if (config.map_style == 'full') {
				config.map_outer_container_element.addClass('full-screen');
			}
			config.map_outer_container_element.prepend($(content));
		};
	}
);
