define(['map_loader', 'params', 'landing_page_view'],
	function(mapLoader, params, landingPageView) {
		return {			
			loadMap: function(options, bundleIds) {
				var skipLandingPageString = params('skipLandingPage');
				//non-landing page should be the default for now
				var skipLandingPage = (skipLandingPageString == null || skipLandingPageString == 'true' || skipLandingPageString == true)

				if (skipLandingPage) {
					if (options == null) {
						options = {};
					}
					options.skipLandingPage = true;
					mapLoader.loadMap(options, bundleIds);
				} else {
					landingPageView();
				}
			},
				
			loadMiniMap: function(options, bundles) {
				mapLoader.loadMiniMap(options, bundleIds);
			}
		};
	}
);
