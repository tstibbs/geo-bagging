import {validateCdkAssets} from '@tstibbs/cloud-core-utils'
import {STACK_NAME} from '../lib/deploy-envs.js'

await validateCdkAssets(STACK_NAME, 1)
