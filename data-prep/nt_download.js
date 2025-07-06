import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './download-with-puppeteer.js'

const urls = [
	['https://www.nationaltrust.org.uk/search', 'config.html'],
	[
		'https://www.nationaltrust.org.uk/api/search/places?query=&lat=54&lon=-2&milesRadius=1000&publicationChannel=NATIONAL_TRUST_ORG_UK',
		'data.json'
	]
]

async function download() {
	return await downloadFiles('nt', urls)
}

await ifCmd(import.meta, download)

export default download
