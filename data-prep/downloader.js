import fs from 'fs';
import request from 'request';
import constants from './constants.js';
import { createTempDir } from './utils.js';

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
        throw err;
	}
}

export {download}
