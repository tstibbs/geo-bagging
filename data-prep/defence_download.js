import fs from 'fs'
import unzipper from 'unzipper'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {createTempDir} from './utils.js'
import {download as downloadFiles} from './downloader.js'
import {tmpInputDir} from './constants.js'

const source =
	'http://archaeologydataservice.ac.uk/catalogue/adsdata/dob_cba_2005/ahds/dissemination/kmz/DoB_Google_Earth.kmz'
const tempFile = 'defence.kmz'
const fileName = 'doc.kml'

async function download() {
	await downloadFiles('defence', {[source]: tempFile})
	const outputDir = `${tmpInputDir}/defence`
	await createTempDir(outputDir)
	let outputFile = fs.createWriteStream(outputDir + '/' + fileName)
	fs.createReadStream(outputDir + '/' + tempFile)
		.pipe(unzipper.Parse())
		.on('entry', entry => {
			entry.pipe(outputFile)
		})
}

await ifCmd(import.meta, download)

export default download
