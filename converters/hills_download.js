const {ifCmd} = require('./utils');
const downloadFiles = require('./downloader').download;

function download() {
	return downloadFiles('hills', {'http://www.hills-database.co.uk/hillcsv.zip': 'hillcsv.zip'});
}

ifCmd(module, download)

module.exports = download;
