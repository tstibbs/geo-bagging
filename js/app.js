var urlBase = "";
if (window != null && window.os_map_base !== undefined) {
	urlBase = window.os_map_base;
}

var versions = {
	leaflet: '1.3.4',
	leaflet_bing: '3.0.3',
    proj4: '2.3.14',
	leaflet_cluster: '1.4.1',
	leaflet_mouseposition: 'b628c7be754c134c63117b3feb75e720a1d20673',
	leaflet_screenposition: '614445ce5e06b1ce20f78b08aad0b9f6e64d6c37',
	leaflet_subgroup: '1.0.2',
	leaflet_matrixlayers: 'c8f0758da314e6eb0716d615b035347a547175ff',
	leaflet_locate: '0.63.0',
	leaflet_controlHider: '3df76ebbfda70789027a40aa6f2e05db603aa364',
	leaflet_boxSelector: '11007fa9e2553353a53c7523d5d964aa8c553fe5',
	leaflet_geosearch: 'ce8da4ded7abbf7c1f590a3337a70e7e25146383',
	leaflet_sidebar: '0.4.0',
	toGeoJson: 'v0.16.0',
	file_saver: '1.3.8',
	underscore: '1.9.1',
	jquery: '3.3.1',
	Squire: '0.2.1',
	sinon: '1.17.5',
	font_awesome: '4.5.0'
};
var packages = {
	leaflet_bing: 'leaflet-plugins',
	proj4: 'proj4js',
	leaflet_cluster: 'leaflet.markercluster',
	leaflet_mouseposition: 'tstibbs/Leaflet.MousePosition',
	leaflet_screenposition: 'xguaita/Leaflet.MapCenterCoord',
	leaflet_subgroup: 'leaflet.featuregroup.subgroup',
	leaflet_matrixlayers: 'tstibbs/Leaflet.MatrixLayersControl',
	leaflet_locate: 'leaflet.locatecontrol',
	leaflet_controlHider: 'tstibbs/Leaflet.ControlHider',
	leaflet_boxSelector: 'tstibbs/Leaflet.BoxSelector',
	leaflet_geosearch: 'tstibbs/L.GeoSearch',
	leaflet_sidebar: 'sidebar-v2',
	toGeoJson: '@mapbox/togeojson',
	file_saver: 'file-saver',
	font_awesome: 'font-awesome',
	underscore: 'underscore.js',
	Squire: 'squirejs',
};

function pkg(package) {
	return packages[package] || package;
}
function unpkg(package, path) {
	return 'https://unpkg.com/' + pkg(package) + '@' + versions[package] + '/' + path;
}
function cloudflare(package, path) {
	return 'https://cdnjs.cloudflare.com/ajax/libs/' + pkg(package) + '/' + versions[package] + '/' + path;
}
function jsdelivrGh(package, path) {
	return 'https://cdn.jsdelivr.net/gh/' + pkg(package) + '@' + versions[package] + '/' + path;
}

var paths = {
	leaflet: unpkg('leaflet', 'dist/leaflet'),
	leaflet_bing: cloudflare('leaflet_bing', 'layer/tile/Bing'),
	proj4: cloudflare('proj4', 'proj4'),
	leaflet_cluster: unpkg('leaflet_cluster', 'dist/leaflet.markercluster-src'),
	leaflet_mouseposition: jsdelivrGh('leaflet_mouseposition', 'src/L.Control.MousePosition'),
	leaflet_screenposition: jsdelivrGh('leaflet_screenposition', 'src/L.Control.MapCenterCoord'),
	leaflet_subgroup: unpkg('leaflet_subgroup', 'dist/leaflet.featuregroup.subgroup'),
	leaflet_matrixlayers: jsdelivrGh('leaflet_matrixlayers', 'src/matrixControl'),
	leaflet_locate: unpkg('leaflet_locate', 'dist/L.Control.Locate.min'),
	leaflet_controlHider: jsdelivrGh('leaflet_controlHider', 'src/hider'),
	leaflet_boxSelector: jsdelivrGh('leaflet_boxSelector', 'src/selector'),
	leaflet_boxSelector_Gpx: jsdelivrGh('leaflet_boxSelector', 'src/gpx'),
	leaflet_geosearch: jsdelivrGh('leaflet_geosearch', 'src/js/l.control.geosearch'),
	leaflet_geosearch_bing: jsdelivrGh('leaflet_geosearch', 'src/js/l.geosearch.provider.bing'),
	leaflet_sidebar: unpkg('leaflet_sidebar', 'js/leaflet-sidebar'),
	toGeoJson: unpkg('toGeoJson', 'togeojson'), 
	file_saver: unpkg('file_saver', 'FileSaver.min'),
	underscore: cloudflare('underscore', 'underscore-min'),
	jquery: 'https://code.jquery.com/jquery-' + versions.jquery
};

var testingPaths = {
	Squire: unpkg('Squire', 'src/Squire'),
	sinon: unpkg('sinon', 'pkg/sinon'),
};

if (window.location.search.indexOf("dev=true") !== -1) {
	paths.leaflet = paths.leaflet + '-src';
	paths.leaflet_matrixlayers = urlBase + '../Leaflet.MatrixLayersControl/src/matrixControl';
	paths.leaflet_boxSelector = urlBase + '../Leaflet.BoxSelector/src/selector';
	paths.leaflet_boxSelector_Gpx = urlBase + '../Leaflet.BoxSelector/src/gpx';
	paths.leaflet_controlHider = urlBase + '../Leaflet.ControlHider/src/hider';
}


requirejs.config({
	baseUrl: urlBase + "js",
	paths: paths,
	shim: {
		leaflet_bing: {
			deps: ['leaflet'],
			exports: 'L.BingLayer'
		},
		leaflet_mouseposition: {
			deps: ['leaflet'],
			exports: 'L.Control.MousePosition'
		},
		leaflet_screenposition: {
			deps: ['leaflet'],
			exports: 'L.Control.MapCenterCoord'
		},
		leaflet_cluster: {
			deps: ['leaflet'],
		},
		leaflet_locate: {
			deps: ['leaflet'],
			exports: 'L.control.locate'
		},
		leaflet_controlHider: {
			deps: ['leaflet'],
			exports: 'L.Control.ControlHider'
		},
		leaflet_geosearch: {
			deps: ['leaflet'],
			exports: 'L.Control.GeoSearch'
		},
		leaflet_geosearch_bing: {
			deps: ['leaflet', 'leaflet_geosearch'],
			exports: 'L.GeoSearch.Provider.Bing'
		},
		leaflet_sidebar: {
			deps: ['leaflet'],
			exports: 'L.Control.Sidebar'
		},
        toGeoJson: {
            deps: ['leaflet'],
            exports: 'toGeoJSON'
        },
		file_saver: {
			exports: 'saveAs'
		},
		proj4js: {
			exports: 'module.exports'
		}
	}
});

function loadCss(url) {
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = url;
    document.getElementsByTagName("head")[0].appendChild(css);
}

[
	jsdelivrGh('leaflet_geosearch', 'src/css/l.geosearch.css'),
	'https://maxcdn.bootstrapcdn.com/' + packages.font_awesome + '/' + versions.font_awesome + '/css/font-awesome.min.css',
	unpkg('leaflet_cluster', 'dist/MarkerCluster.Default.css'),
	unpkg('leaflet_cluster', 'dist/MarkerCluster.css'),
	unpkg('leaflet', 'dist/leaflet.css'),
	unpkg('leaflet_sidebar', 'css/leaflet-sidebar.css'),
	urlBase + 'css/app.css',
].forEach(loadCss);

[
	'leaflet_screenposition',
	'leaflet_mouseposition',
	'leaflet_locate',
	'leaflet_matrixlayers',
	'leaflet_controlHider',
	'leaflet_boxSelector'
].forEach(function(name) {
	loadCss(paths[name] + '.css');
});
