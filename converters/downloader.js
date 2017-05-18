const fs = require('fs');
const request = require('request');

function download(source, outputDir, fileName) {
	if (!fs.existsSync(outputDir)){
		fs.mkdirSync(outputDir);
	}
	
	let dest = outputDir + '/' + fileName;
	return new Promise((resolve, reject) => {
		let file = fs.createWriteStream(dest);
		request(source)
		.pipe(file)
		.on('finish', () => {
			resolve();
			file.close(resolve);
		}).on('error', (err) => {
			console.log(err);
			fs.unlink(dest, reject);
		});
	});
}

function downloadSingle(source, outputDir, fileName) {
	return download(source, outputDir, fileName).then(values => { 
		console.log(`finished downloading ${source}`);
		return '';
	}).catch(reason => { 
		console.log(`something went wrong downloading ${source}: ${reason}`);
	});
}

module.exports.download = download;
module.exports.downloadSingle = downloadSingle;
