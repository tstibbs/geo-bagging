define(['jquery', './config_base', 'custom_default_icon'],
	function($, trigpointingBase, CustomDefaultIcon) {
		var redIconPath = window.os_map_base + 'img/hill.png';
		return $.extend(true, {
			icons: {
				searchResult: new CustomDefaultIcon(redIconPath, {iconUrl: redIconPath})
			}
		}, trigpointingBase);
	}
);
