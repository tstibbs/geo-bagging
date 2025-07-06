import fs from 'fs'
import request from 'request'
import {tmpInputDir} from './constants.js'
import {createTempDir} from './utils.js'

function _downloadSingle(source, destination) {
	return new Promise((resolve, reject) => {
		let file = fs.createWriteStream(destination)
		let req = request(source)
		req
			.on('error', err => {
				//request error
				req.abort()
				reject(new Error(err))
			})
			.on('response', response => {
				let {statusCode} = response
				if (statusCode != 200) {
					console.error(
						`${statusCode} returned by ${source} with headers: \n${JSON.stringify(response.headers, null, 2)}`
					)
					req.abort()
					reject(new Error(statusCode))
				}
			})
			.pipe(file)
			.on('finish', () => {
				file.close(() => {
					resolve()
				})
			})
			.on('error', err => {
				//stream error
				console.log(err)
				fs.unlink(destination, reject)
			})
	})
}

export async function _downloadMultiple(bundleName, urls, downloaderFunction) {
	let outputDir = `${tmpInputDir}`
	if (bundleName != null) {
		outputDir += `/${bundleName}`
	}
	await createTempDir(outputDir)
	let orderedArrayOfUrls = Array.isArray(urls) ? urls : Object.entries(urls)
	let from = bundleName != null ? bundleName : Object.keys(urls).join(';')
	try {
		for (const [url, fileName] of orderedArrayOfUrls) {
			console.log(`Downloading ${url} to ${outputDir}/${fileName}`)
			await downloaderFunction(url, outputDir + '/' + fileName)
		}
	} catch (err) {
		console.log(`Error downloading '${from}': ${err}`)
		throw err
	}
}

export async function download(bundleName, urls) {
	return await _downloadMultiple(bundleName, urls, _downloadSingle)
}
