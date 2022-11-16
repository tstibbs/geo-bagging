//just import everything and check there are no errors - no value in testing beyond this
import {readdirSync} from 'fs'

for (let file of readdirSync('.').filter(entry => entry.endsWith('.js'))) {
	console.log(file)
	await import(`../${file}`)
}
