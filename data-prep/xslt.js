import {spawn} from 'child_process'
import {inputDataDir} from './constants.js'

async function transform(xslt, input, output) {
	return new Promise((resolve, reject) => {
		let child = spawn(
			`pnpm`,
			[`exec`, `xslt3`, `-xsl:${xslt}`, `-s:${inputDataDir}/${input}`, `-o:${inputDataDir}/${output}`, `-t`],
			{
				stdio: 'inherit'
			}
		)
		child.on('close', exitCode => {
			if (exitCode == 0) {
				resolve()
			} else {
				console.error(`Non-zero exit code: ${exitCode}`)
				reject(new Error(exitCode))
			}
		})
	})
}

export default transform
