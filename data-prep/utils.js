import request from 'request'
import util from 'util'
import fs from 'fs'
import esMain from 'es-main'

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

async function doIfCmdCall(importMeta, doit) {
	//execute if run from command line
	if (esMain(importMeta)) {
		try {
			await doit()
		} catch (err) {
			console.log(err)
			process.exit(1)
		}
	}
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

export const ifCmd = doIfCmdCall

export {get, createTempDir, deleteFile}
