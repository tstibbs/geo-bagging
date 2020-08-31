import {ifCmd} from './utils.js'
import {download as downloadFiles} from './downloader.js'

function download() {
	return downloadFiles('hills', {
		'http://www.hills-database.co.uk/hillcsv.zip': 'hillcsv.zip'
	})
}

ifCmd(import.meta, download)

export default download
