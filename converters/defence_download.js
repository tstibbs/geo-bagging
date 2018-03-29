const fs = require('fs');
const unzip = require('unzip');
const ifCmd = require('./utils').doIfCmdCall;
const downloadFiles = require('./downloader').download;
const constants = require('./constants');

const source = 'http://archaeologydataservice.ac.uk/catalogue/adsdata/dob_cba_2005/ahds/dissemination/kmz/DoB_Google_Earth.kmz';
const tempFile = 'defence.kmz';
const fileName = 'doc.kml';

function download() {
	return downloadFiles('defence', {[source]: tempFile}).then(() => {
		const outputDir = `${constants.tmpInputDir}/defence`;
		let outputFile = fs.createWriteStream(outputDir + '/' + fileName);
		fs.createReadStream(outputDir + '/' + tempFile)
			.pipe(unzip.Parse())
			.on('entry', function (entry) {
				entry.pipe(outputFile);
			});
	}).catch(err => {
		console.log(err);
	});
}

ifCmd(module, download)

module.exports = download;
