import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

async function download() {
	return await downloadFiles('hills', {
		'http://www.hills-database.co.uk/hillcsv.zip': 'hillcsv.zip'
	})
}

await ifCmd(import.meta, download)

export default download
