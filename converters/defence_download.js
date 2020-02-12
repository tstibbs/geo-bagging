const fs = require('fs');
const unzipper = require('unzipper');
const {ifCmd, createTempDir} = require('./utils');
const downloadFiles = require('./downloader').download;
const constants = require('./constants');

const source = 'http://archaeologydataservice.ac.uk/catalogue/adsdata/dob_cba_2005/ahds/dissemination/kmz/DoB_Google_Earth.kmz';
const tempFile = 'defence.kmz';
const fileName = 'doc.kml';

async function download() {
	await downloadFiles('defence', { [source]: tempFile });
    const outputDir = `${constants.tmpInputDir}/defence`;
    await createTempDir(outputDir);
    let outputFile = fs.createWriteStream(outputDir + '/' + fileName);
    fs.createReadStream(outputDir + '/' + tempFile)
        .pipe(unzipper.Parse())
        .on('entry', entry => {
            entry.pipe(outputFile);
        });
}

ifCmd(module, download)

module.exports = download;
