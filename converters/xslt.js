const { spawn } = require('child_process');
const fs = require('fs');
const downloadFiles = require('./downloader').download;
const constants = require('./constants');

const artifact = `Saxon-HE`
const version = `9.8.0-6`
const jarName = `${artifact}-${version}.jar`
const downloadPath = `http://repo1.maven.org/maven2/net/sf/saxon/${artifact}/${version}/${jarName}`
const jarPath = `${constants.tmpInputDir}/${jarName}`

let downloadInProgress = null;

function _downloadJar() {
	if (downloadInProgress == null) {
		if (fs.existsSync(jarPath)) {
			downloadInProgress = Promise.resolve();
		} else {
			downloadInProgress = downloadFiles(null, {[downloadPath]: jarName});
		}
	}
	return downloadInProgress;
}

function transform(xslt, input, output) {
	return _downloadJar().then(() => {
		return new Promise((resolve, reject) => {
			//assumes java is on the path
			var child = spawn(`java`, [
				`-jar`,
				`${constants.tmpInputDir}/Saxon-HE-9.8.0-6.jar`,
				`-xsl:${xslt}`,
				`-s:${constants.tmpInputDir}/${input}`,
				`-o:${constants.tmpInputDir}/${output}`
			], {
				stdio: 'inherit'
			});
			child.on('close', function (exitCode) {
				if (exitCode == 0) {
					resolve();
				} else {
					console.error(`Non-zero exit code: ${exitCode}`);
					reject(exitCode);
				}
			});
		});
	});
}

module.exports = transform;
