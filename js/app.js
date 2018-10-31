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
	leaflet_matrixlayers: '05318f006202d77de2e0382b033d018eeed5edc6',
	leaflet_locate: '0.63.0',
	leaflet_controlHider: '3df76ebbfda70789027a40aa6f2e05db603aa364',
	leaflet_boxSelector: '11007fa9e2553353a53c7523d5d964aa8c553fe5',
	leaflet_geosearch: 'ce8da4ded7abbf7c1f590a3337a70e7e25146383',
	leaflet_draw: '1.0.3',
	leaflet_sidebar: '0.4.0',
	file_saver: '1.3.8',
	underscore: '1.9.1',
	jquery: '3.3.1',
	Squire: '0.2.1',
	sinon: '1.17.5',
	font_awesome: '4.5.0'
};

var paths = {
	leaflet: 'https://unpkg.com/leaflet@' + versions.leaflet + '/dist/leaflet',
	leaflet_bing: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-plugins/' + versions.leaflet_bing + '/layer/tile/Bing',
	proj4: 'https://cdnjs.cloudflare.com/ajax/libs/proj4js/' + versions.proj4 + '/proj4',
	leaflet_cluster: 'https://unpkg.com/leaflet.markercluster@' + versions.leaflet_cluster + '/dist/leaflet.markercluster-src',
	leaflet_mouseposition: 'https://cdn.jsdelivr.net/gh/tstibbs/Leaflet.MousePosition@' + versions.leaflet_mouseposition + '/src/L.Control.MousePosition',
	leaflet_screenposition: 'https://cdn.jsdelivr.net/gh/xguaita/Leaflet.MapCenterCoord@' + versions.leaflet_screenposition + '/src/L.Control.MapCenterCoord',
	leaflet_subgroup: 'https://unpkg.com/leaflet.featuregroup.subgroup@' + versions.leaflet_subgroup + '/dist/leaflet.featuregroup.subgroup',
	leaflet_matrixlayers: 'https://cdn.jsdelivr.net/gh/tstibbs/Leaflet.MatrixLayersControl@' + versions.leaflet_matrixlayers + '/src/matrixControl',
	leaflet_locate: 'https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@' + versions.leaflet_locate + '/dist/L.Control.Locate.min',
	leaflet_controlHider: 'https://cdn.jsdelivr.net/gh/tstibbs/Leaflet.ControlHider@' + versions.leaflet_controlHider + '/src/hider',
	leaflet_boxSelector: 'https://cdn.jsdelivr.net/gh/tstibbs/Leaflet.BoxSelector@' + versions.leaflet_boxSelector + '/src/selector',
	leaflet_boxSelector_Gpx: 'https://cdn.jsdelivr.net/gh/tstibbs/Leaflet.BoxSelector@' + versions.leaflet_boxSelector + '/src/gpx',
	leaflet_geosearch: 'https://cdn.jsdelivr.net/gh/tstibbs/L.GeoSearch@' + versions.leaflet_geosearch + '/src/js/l.control.geosearch',
	leaflet_geosearch_bing: 'https://cdn.jsdelivr.net/gh/tstibbs/L.GeoSearch@' + versions.leaflet_geosearch + '/src/js/l.geosearch.provider.bing',
	leaflet_draw: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/' + versions.leaflet_draw + '/leaflet.draw',
	leaflet_sidebar: 'https://unpkg.com/sidebar-v2@' + versions.leaflet_sidebar + '/js/leaflet-sidebar',
	file_saver: 'https://unpkg.com/file-saver@' + versions.file_saver + '/FileSaver.min',
	underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/' + versions.underscore + '/underscore-min',
	jquery: 'https://code.jquery.com/jquery-' + versions.jquery
};

var testingPaths = {
	Squire: 'https://unpkg.com/squirejs@' + versions.Squire + '/src/Squire',
	sinon: 'https://unpkg.com/sinon@' + versions.sinon + '/pkg/sinon'
};

if (window.location.search.indexOf("dev=true") !== -1) {
	paths.leaflet = paths.leaflet + '-src';
	paths.leaflet_matrixlayers = '../../Leaflet.MatrixLayersControl/src/matrixControl';
	paths.leaflet_boxSelector = '../../Leaflet.BoxSelector/src/selector';
	paths.leaflet_boxSelector_Gpx = '../../Leaflet.BoxSelector/src/gpx';
	paths.leaflet_controlHider = '../../Leaflet.ControlHider/src/hider';
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
		leaflet_draw: {
			deps: ['leaflet'],
			exports: 'L.Draw'
		},
		leaflet_sidebar: {
			deps: ['leaflet'],
			exports: 'L.Control.Sidebar'
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
	'https://cdn.jsdelivr.net/gh/tstibbs/L.GeoSearch@' + versions.leaflet_geosearch + '/src/css/l.geosearch.css',
	'https://maxcdn.bootstrapcdn.com/font-awesome/' + versions.font_awesome + '/css/font-awesome.min.css',
	'https://cdn.jsdelivr.net/gh/Leaflet/Leaflet.markercluster@' + versions.leaflet_cluster + '/dist/MarkerCluster.Default.css',
	'https://cdn.jsdelivr.net/gh/Leaflet/Leaflet.markercluster@' + versions.leaflet_cluster + '/dist/MarkerCluster.css',
	'https://unpkg.com/leaflet@' + versions.leaflet + '/dist/leaflet.css',
	'https://unpkg.com/sidebar-v2@' + versions.leaflet_sidebar + '/css/leaflet-sidebar.css',
	urlBase + 'css/app.css',
].forEach(loadCss);

[
	'leaflet_screenposition',
	'leaflet_mouseposition',
	'leaflet_locate',
	'leaflet_matrixlayers',
	'leaflet_controlHider',
	'leaflet_boxSelector',
	'leaflet_draw'
].forEach(function(name) {
	loadCss(paths[name] + '.css');
});
