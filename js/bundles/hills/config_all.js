define(['jquery', './config'],
	function($, config) {
		return $.extend({}, config, {dataToLoad: 'data_all.json'});
	}
);
