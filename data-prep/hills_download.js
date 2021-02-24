import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

function download() {
	return downloadFiles('hills', {
		'http://www.hills-database.co.uk/hillcsv.zip': 'hillcsv.zip'
	})
}

await ifCmd(import.meta, download)

export default download
