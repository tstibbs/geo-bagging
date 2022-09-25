import {validateCdkAssets} from '@tstibbs/cloud-core-utils'
import {STACK_NAME} from '../lib/deploy-envs.js'

test('Assets are built as expected', async () => {
	await validateCdkAssets(STACK_NAME, 1) //should only be the s3 bucket emptier
})
