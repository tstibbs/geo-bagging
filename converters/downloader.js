const fs = require('fs');
const request = require('request');
const constants = require('./constants');
const {createTempDir} = require('./utils');

function _downloadSingle(source, destination) {
	return new Promise((resolve, reject) => {
		let file = fs.createWriteStream(destination);
        let req = request(source);  
        req
        .on('error', err => { //request error
                req.abort();
                reject(err);
        })
        .on('response', response => {
            if (response.statusCode != 200) {
                req.abort();
                reject(response.statusCode);
            }
        })
        .pipe(file)
        .on('finish', () => {
            file.close(() => {
                resolve();
            });
        })
        .on('error', (err) => { //stream error
            console.log(err);
            fs.unlink(destination, reject);
        });
	});
}

async function download(bundleName, urls) {
    await createTempDir(constants.tmpInputDir);
	let outputDir = `${constants.tmpInputDir}`;
	if (bundleName != null) {
		outputDir += `/${bundleName}`;
	}
    await createTempDir(outputDir);
	let promises = Object.entries(urls).map(([url, fileName]) => 
		_downloadSingle(url, outputDir + '/' + fileName)
	);
    let from = bundleName != null ? bundleName : Object.keys(urls).join(';');
    try {
        await Promise.all(promises);
    } catch (err) { 
        console.log(`Error downloading '${from}': ${err}`)
        throw error;
	}
}

module.exports.download = download;
