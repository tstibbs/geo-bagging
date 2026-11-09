import {ifCmd} from '@tstibbs/cloud-core-utils'

import {printNotificationLog} from '@tstibbs/cloud-core-utils/src/stacks/codebuild-failure-notification/src/format.js'

import {run as runAll} from './all.js'

async function run() {
	const resultMessage = await runAll(false)
	printNotificationLog(resultMessage)
}

await ifCmd(import.meta, run)
