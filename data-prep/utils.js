import {mkdir, unlink} from 'node:fs/promises'
import {exists as rawExists} from 'node:fs'
import {promisify} from 'node:util'

import {exec as rawExec} from '@tstibbs/cloud-core-utils'
import uiConstants from '../ui/src/js/constants.js'

const exists = promisify(rawExists)

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
		fetchCommand = `curl ${uiConstants.dataBackendBaseUrl}${source}/${file} -o ${outputFile}`
	} else {
		fetchCommand = `git show :ui/src/js/bundles/${source}/${file} > ${outputFile}`
	}
	const command = `mkdir -p tmp-input/old-data/${source} && ${fetchCommand}`
	console.log(`exec: ${command}`)
	await exec(command)
}

async function createTempDir(inputDir) {
	let dirExists = await exists(inputDir)
	if (!dirExists) {
		await mkdir(inputDir, {recursive: true})
	}
}

async function deleteFile(file) {
	let fileExists = await exists(file)
	if (fileExists) {
		await unlink(file)
	}
}

export {createTempDir, deleteFile, exec, backUpReferenceData}
