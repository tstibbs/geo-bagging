import {ifCmd} from '@tstibbs/cloud-core-utils'
import {run as runAll} from './all.js'

async function run() {
	await runAll(false)
}

await ifCmd(import.meta, run)
