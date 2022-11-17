import request from 'request'
import util from 'util'
import fs from 'fs'

import {exec as rawExec} from '@tstibbs/cloud-core-utils'
import uiConstants from '../ui/src/js/constants.js'
const {dataBackendBaseUrl} = uiConstants

async function exec(command) {
	let {stdout, stderr} = await rawExec(command)
	if (stdout) {
		console.log(stdout)
	}
	if (stderr) {
		console.log(stderr)
	}
}

async function backUpReferenceData(source, file) {
	const outputFile = `tmp-input/old-data/${source}/${file}`
	let fetchCommand
	if (['nt', 'trigs'].includes(source)) {
		fetchCommand = `curl ${dataBackendBaseUrl}${source}/${file} -o ${outputFile}`
	} else {
		fetchCommand = `git show :ui/src/js/bundles/${source}/${file} > ${outputFile}`
	}
	const command = `mkdir -p tmp-input/old-data/${source} && ${fetchCommand}`
	console.log(`exec: ${command}`)
	await exec(command)
}

function get(path) {
	return new Promise((resolve, reject) => {
		request(path, (error, response, body) => {
			if (error) {
				reject(error)
			} else {
				resolve([body, path])
			}
		})
	})
}

async function createTempDir(inputDir) {
	let exists = await util.promisify(fs.exists)(inputDir)
	if (!exists) {
		await util.promisify(fs.mkdir)(inputDir, {recursive: true})
	}
}

async function deleteFile(file) {
	let exists = await util.promisify(fs.exists)(file)
	if (exists) {
		await util.promisify(fs.unlink)(file)
	}
}

export const readFile = util.promisify(fs.readFile)
export const writeFile = util.promisify(fs.writeFile)
export const readdir = util.promisify(fs.readdir)

export {get, createTempDir, deleteFile, exec, backUpReferenceData}
