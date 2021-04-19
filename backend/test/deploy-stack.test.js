import {checkAllStackPolicies} from '@tstibbs/cloud-core-utils'
import {buildStack} from '../lib/deploy-utils.js'

describe('Stack meets our policies', () => {
	checkAllStackPolicies(buildStack())
})
