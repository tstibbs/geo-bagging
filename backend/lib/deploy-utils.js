import cdk from '@aws-cdk/core'
import {DeployStack} from '../lib/deploy-stack.js'
import {STACK_NAME} from './deploy-envs.js'

export function buildStack() {
	const app = new cdk.App()
	return new DeployStack(app, STACK_NAME)
}
