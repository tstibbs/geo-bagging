import axios from 'axios'
import {createWriteStream} from 'fs'

import {ifCmd} from '@tstibbs/cloud-core-utils'
import {TRIGS_USERNAME, TRIGS_PASSWORD} from './envs.js'
import {tmpInputDir} from './constants.js'
import {createTempDir} from './utils.js'

const credentials = {
	loginid: TRIGS_USERNAME,
	loginpw: TRIGS_PASSWORD,
	submit: 'Login'
}

const loginUrl = 'https://trigpointing.uk/login.php'
const csvDownloadUrl = 'https://trigpointing.uk/trigs/down-csv.php'
const outputDir = `${tmpInputDir}/trigs`
const outputFileName = `${outputDir}/trigpoints.csv`

async function download() {
	if (!credentials.loginid || !credentials.loginpw) {
		console.error('Error: TRIGS_USERNAME and TRIGS_PASSWORD must be set in the .env file.')
		return
	}
	await createTempDir(outputDir)

	//login
	const loginResponse = await axios.post(loginUrl, new URLSearchParams(credentials).toString(), {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		maxRedirects: 0, // Prevent axios from following the redirect automatically
		validateStatus: function (status) {
			// We expect a 302 (redirect) for a successful login.
			return status === 302
		}
	})
	const cookies = loginResponse.headers['set-cookie']
	if (!cookies) {
		throw new Error('Could not capture cookies from login response.')
	}

	//request csv file
	const cookieHeader = cookies.map(cookie => cookie.split(';')[0]).join('; ')
	const csvResponse = await axios.get(csvDownloadUrl, {
		headers: {
			Cookie: cookieHeader
		},
		responseType: 'stream'
	})

	//save to file
	const writer = createWriteStream(outputFileName)
	csvResponse.data.pipe(writer)
	return new Promise((resolve, reject) => {
		writer.on('finish', () => {
			resolve()
		})
		writer.on('error', err => {
			console.error('Error writing file to disk.')
			reject(new Error(err))
		})
	})
}

await ifCmd(import.meta, download)

export default download
