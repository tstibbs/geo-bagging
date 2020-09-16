import {exec as nodeExec} from 'child_process'
import esMain from 'es-main'

export function exec(command) {
	return new Promise((resolve, reject) => {
		nodeExec(command, (error, stdout, stderr) => {
			if (error) {
				reject({
					error,
					stdout,
					stderr
				})
			} else {
				resolve({
					stdout,
					stderr
				})
			}
		})
	})
}

export async function ifCmd(importMeta, doit) {
	//execute only if run from command line
	if (esMain(importMeta)) {
		try {
			await doit()
		} catch (err) {
			console.log(err)
			process.exit(1)
		}
	}
}
