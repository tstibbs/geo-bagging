import {spawn} from 'child_process'
import {tmpInputDir} from './constants.js'

async function transform(xslt, input, output) {
	return new Promise((resolve, reject) => {
		let child = spawn(
			`npx`,
			[`xslt3`, `-xsl:${xslt}`, `-s:${tmpInputDir}/${input}`, `-o:${tmpInputDir}/${output}`, `-t`],
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
