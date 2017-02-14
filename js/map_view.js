define(['jquery'],
	function($) {
		//creates the html we need to display errors, loading screen and the map container
		return function(config) {
			var content = '';

			content+= 	'<div id="error-container" style="display: none;">';
			content+= 		'<p class="title">Some errors have occurred:</p>';
			content+= 		'<div id="errors-list"></div>';
			content+= 		'<a id="dismiss-button" href="#">Hide</a>';
			content+= 	'</div>';
			if (config.mini) {
				content+= 	'<div class="mini-map">';
			}
			content+= 		'<div id="loading-message-pane" class="full-screen">';
			content+= 			'<div class="loading-message-container">';
			content+= 				'<div class="loading-message-text">';
			content+= 					'<p>Loading...</p>';
			content+= 				'</div>';
			content+= 			'</div>';
			content+= 		'</div>';
			content+= 		'<div id="map" class="' + (config.mini ? 'mini-map' : 'full-screen') + '"></div>';
			if (config.mini) {
				content+= 	'</div>';
				content+= 	'<div class="full-screen-link"></div>';
			}

			if (!config.mini) {
				$('body').addClass('full-screen');
			}
			$('body').prepend($(content));
		}
	}
);
