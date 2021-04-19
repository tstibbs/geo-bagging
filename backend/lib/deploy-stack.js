import cdk from '@aws-cdk/core'
import nodejsLambda from '@aws-cdk/aws-lambda-nodejs'
import lambda from '@aws-cdk/aws-lambda'
import apig from '@aws-cdk/aws-apigateway'
import {CLIENT_ID, CLIENT_SECRET, COOKIE_SECRET, API_GATEWAY_URL} from './deploy-envs.js'

class DeployStack extends cdk.Stack {
	constructor(scope, id, props) {
		super(scope, id, props)

		const webBackEndFunction = new nodejsLambda.NodejsFunction(this, 'webBackEndFunction', {
			entry: 'src/app.js',
			environment: {
				CLIENT_ID,
				CLIENT_SECRET,
				COOKIE_SECRET,
				API_GATEWAY_URL
			},
			memorySize: 512,
			timeout: cdk.Duration.seconds(20),
			runtime: lambda.Runtime.NODEJS_14_X
		})

		new apig.LambdaRestApi(this, 'webBackEndInterfaceApi', {
			handler: webBackEndFunction,
			cloudWatchRole: false
		})
	}
}

export {DeployStack}
