import {deploy, loadEnvs, ifCmd} from '@tstibbs/cloud-core-utils'

const stackName = 'geo-bagging-backend'
const templatePath = './deploy/template.yml'
const capabilities = ['CAPABILITY_NAMED_IAM']
const artifacts = {
	'web-back-end': {
		file: './dist/function.zip',
		versionParameterToInject: 'CodeVersionWebBackEnd'
	}
}
const parameters = loadEnvs({
	CLIENT_ID: 'ClientId',
	CLIENT_SECRET: 'ClientSecret',
	COOKIE_SECRET: 'CookieSecret'
})
const {cfServiceRole} = loadEnvs({
	CF_ROLE_ARN: 'cfServiceRole' //e.g. arn:aws:iam::123456789:role/role-name'
})

async function run() {
	await deploy(stackName, templatePath, capabilities, cfServiceRole, artifacts, parameters)
}

await ifCmd(import.meta, run)
