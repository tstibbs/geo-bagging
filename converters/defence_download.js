const fs = require('fs');
const unzip = require('unzip');
const download = require('./downloader').downloadSingle;

const source = 'http://archaeologydataservice.ac.uk/catalogue/adsdata/dob_cba_2005/ahds/dissemination/kmz/DoB_Google_Earth.kmz';
const outputDir = 'defence-input';
const tempFile = 'defence.kmz';
const fileName = 'doc.kml';

download(source, outputDir, tempFile).then(() => {
	let outputFile = fs.createWriteStream(outputDir + '/' + fileName);
	fs.createReadStream(outputDir + '/' + tempFile)
		.pipe(unzip.Parse())
		.on('entry', function (entry) {
			entry.pipe(outputFile);
		});
}).catch(err => {
	console.log(err);
});
