import {App} from 'aws-cdk-lib'
import {DeployStack} from '../lib/deploy-stack.js'

export function buildStack(stackName) {
	const app = new App()
	return new DeployStack(app, stackName)
}
