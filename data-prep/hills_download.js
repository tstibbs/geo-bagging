import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

async function download() {
	return await downloadFiles('hills', {
		'https://www.hill-bagging.co.uk/dobih-downloads/hillcsv.zip': 'hillcsv.zip'
	})
}

await ifCmd(import.meta, download)

export default download
