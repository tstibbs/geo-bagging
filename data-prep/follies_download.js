import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

async function download() {
	//it's currently unclear whether this url could change
	return await downloadFiles('follies', {
		'https://www.google.com/maps/d/kml?mid=1vdvCMUsubYUvduWZTZIVdXO7Di8&forcekml=1': 'follies.kml'
	})
}

await ifCmd(import.meta, download)

export default download
