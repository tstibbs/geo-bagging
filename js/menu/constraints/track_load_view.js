import leaflet from 'VendorWrappers/leaflet';
import $ from 'jquery';
import toGeoJSON from '@mapbox/togeojson';
import TracksView from './tracks_view';

var TrackLoadView = leaflet.Class.extend({
	initialize: function (manager, constraintsView) {
		this._constraintsView = constraintsView;
		this._tracksView = new TracksView(manager);
		this._view = $('<div class="setting"></div>');
		this._view.append($('<span>Upload GPX tracks to see markers around those tracks:</span>'));
		this._fileInput = $('<input type="file" multiple>');
		this._view.append(this._fileInput);
		this._fileInput.on('change', this._readFiles.bind(this));
	},
	
	_readFiles: function() {
		var tracks = [];
		var files = this._fileInput[0].files;
		for (var i = 0; i < files.length; i++) {
			(function(file) {//just scoping
				var reader = new FileReader();
				//note this function is called asynchronously
				reader.onload = function(e) {
					var track = this._loadTrack(reader.result);
					tracks.push(track);
					if (tracks.length == files.length) {
						this._finishedReadingFiles(tracks);
					}
				}.bind(this)
				reader.readAsText(file);
			}.bind(this))(files.item(i));
		}
	},
	
	_finishedReadingFiles: function(tracks) {
		var bounds = tracks.map(function(track) {
			return track.bounds;
		});
		var features = tracks.map(function(track) {
			return track.features;
		});
		this._constraintsView.limitTo(this, bounds);
		this._tracksView.showTracks(features);
	},
	
	_loadTrack: function(xmlString) {
		var dom = (new DOMParser()).parseFromString(xmlString, 'text/xml');
		var geoJson = toGeoJSON.gpx(dom);
		var bounds = this._geoJsonBounds(geoJson);
		return {
			features: geoJson,
			bounds: bounds
		};
	},
	
	_geoJsonBounds: function(geoJson) {
		var minLng;
		var maxLng;
		var minLat;
		var maxLat;
		geoJson.features.forEach(function(feature) {
			var geometry = feature.geometry;
			var lineParser = function(line) {
				line.forEach(function(point) {
					var lng = point[0]
					var lat = point[1];
					if (minLng == null || lng < minLng) {
						minLng = lng;
					}
					if (maxLng == null || lng > maxLng) {
						maxLng = lng;
					}
					if (minLat == null || lat < minLat) {
						minLat = lat;
					}
					if (maxLat == null || lat > maxLat) {
						maxLat = lat;
					}
				});
			};
			if (geometry.type == 'MultiLineString') {
				geometry.coordinates.forEach(lineParser);
			} else {
				lineParser(geometry.coordinates);
			}
		});
		var latAdjustment = 0.005;//just to extend the bounding box a bit
		var lngAdjustment = 0.01;
		var bottomLeft = [minLat - latAdjustment, minLng - lngAdjustment];
		var topRight = [maxLat + latAdjustment, maxLng + lngAdjustment];
		return leaflet.latLngBounds(bottomLeft, topRight);
	},
	
	getView: function() {
		return this._view;
	},
	
	reset: function() {
		this._fileInput.val('');
		this._tracksView.showTracks([]);
	}
});

export default TrackLoadView
