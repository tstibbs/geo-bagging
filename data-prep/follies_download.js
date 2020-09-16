import {ifCmd} from '../shared/utils.js'
import {download as downloadFiles} from './downloader.js'

function download() {
	//it's currently unclear whether this url could change
	return downloadFiles('follies', {
		'https://www.google.com/maps/d/kml?mid=1vdvCMUsubYUvduWZTZIVdXO7Di8&forcekml=1': 'follies.kml'
	})
}

ifCmd(import.meta, download)

export default download
