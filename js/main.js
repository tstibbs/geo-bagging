define(['map_loader', 'params', 'landingpage/view'],
	function(mapLoader, params, LandingPageView) {
		return {			
			loadMap: function(options, bundleIds) {
				var skipLandingPageString = params('skipLandingPage');
				//non-landing page should be the default for now
				var skipLandingPage = (skipLandingPageString == null || skipLandingPageString == 'true' || skipLandingPageString === true);

				if (skipLandingPage) {
					if (options == null) {
						options = {};
					}
					options.skipLandingPage = true;
					return mapLoader.loadMap(options, bundleIds);
				} else {
					return new LandingPageView();
				}
			},
				
			loadMiniMap: function(options, bundleIds) {
				mapLoader.loadMiniMap(options, bundleIds);
			}
		};
	}
);
