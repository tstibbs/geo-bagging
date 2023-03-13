import {spawn} from 'child_process'
import fs from 'fs'
import {download as downloadFiles} from './downloader.js'
import {tmpInputDir} from './constants.js'

const artifact = `Saxon-HE`
const version = `10.9`
const jarName = `${artifact}-${version}.jar`
const downloadPath = `https://repo1.maven.org/maven2/net/sf/saxon/${artifact}/${version}/${jarName}`
const jarPath = `${tmpInputDir}/${jarName}`

let downloadInProgress = null

function _downloadJar() {
	if (downloadInProgress == null) {
		if (fs.existsSync(jarPath)) {
			downloadInProgress = Promise.resolve()
		} else {
			downloadInProgress = downloadFiles(null, {[downloadPath]: jarName})
		}
	}
	return downloadInProgress
}

async function transform(xslt, input, output) {
	await _downloadJar()
	return new Promise((resolve, reject) => {
		//assumes java is on the path
		let child = spawn(
			`java`,
			[
				`-jar`,
				`${tmpInputDir}/${jarName}`,
				`-xsl:${xslt}`,
				`-s:${tmpInputDir}/${input}`,
				`-o:${tmpInputDir}/${output}`
			],
			{
				stdio: 'inherit'
			}
		)
		child.on('close', exitCode => {
			if (exitCode == 0) {
				resolve()
			} else {
				console.error(`Non-zero exit code: ${exitCode}`)
				reject(exitCode)
			}
		})
	})
}

export default transform
