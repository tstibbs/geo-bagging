const fs = require('fs');
const request = require('request');
const constants = require('./constants');
const {createTempDir} = require('./utils');

function _downloadSingle(source, destination) {
	return new Promise((resolve, reject) => {
		let file = fs.createWriteStream(destination);
		request(source)
		.pipe(file)
		.on('finish', () => {
			file.close(() => {
				resolve();
			});
		}).on('error', (err) => {
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
	return Promise.all(promises).then(values => {
		console.log(`Finished downloading '${from}'.`);
		return values;
	}).catch(reason => { 
		console.log(`Error downloading '${from}': ${reason}`)
	});
}

module.exports.download = download;
