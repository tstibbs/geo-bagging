const {ifCmd} = require('./utils');
const downloadFiles = require('./downloader').download;

function download() {
	//it's currently unclear whether this url could change
	return downloadFiles('follies', {'https://www.google.com/maps/d/kml?mid=1vdvCMUsubYUvduWZTZIVdXO7Di8&forcekml=1': 'follies.kml'});
}

ifCmd(module, download)

module.exports = download;
