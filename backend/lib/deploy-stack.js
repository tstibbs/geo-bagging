import {Stack} from 'aws-cdk-lib'
import {applyStandardTags} from '@tstibbs/cloud-core-utils'
import {WebsiteResources} from '@tstibbs/cloud-core-utils/src/stacks/website.js'
import {COUNTRIES_DENY_LIST} from './deploy-envs.js'
import {dataPrepTestBuild} from './test-data-prep.js'

const countriesDenyList = COUNTRIES_DENY_LIST.split(',')

class DeployStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props)

		new WebsiteResources(this, 'geoBaggingData', countriesDenyList, true)
		dataPrepTestBuild(this)
		applyStandardTags(this)
	}
}

export {DeployStack}
