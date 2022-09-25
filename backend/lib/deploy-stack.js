import {Stack} from 'aws-cdk-lib'

import {buildWebsiteResources, applyStandardTags} from '@tstibbs/cloud-core-utils'
import {COUNTRIES_DENY_LIST} from './deploy-envs.js'

const countriesDenyList = COUNTRIES_DENY_LIST.split(',')

class DeployStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props)
		buildWebsiteResources(this, 'geoBaggingData', countriesDenyList)
		applyStandardTags(this)
	}
}

export {DeployStack}
