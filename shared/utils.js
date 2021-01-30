import {exec as nodeExec} from 'child_process'

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
