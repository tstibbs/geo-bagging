import {Stack, Fn, Aws, Duration} from 'aws-cdk-lib'
import {CfnAccount} from 'aws-cdk-lib/aws-apigateway'
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import {HttpApi, HttpMethod, CorsHttpMethod} from '@aws-cdk/aws-apigatewayv2-alpha'
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs'
import {Runtime} from 'aws-cdk-lib/aws-lambda'
import {HttpOrigin} from 'aws-cdk-lib/aws-cloudfront-origins'
import {ResponseHeadersPolicy, ViewerProtocolPolicy, AllowedMethods, CachePolicy} from 'aws-cdk-lib/aws-cloudfront'

import {buildWebsiteResources, applyStandardTags} from '@tstibbs/cloud-core-utils'
import {addUsageTrackingToHttpApi} from '@tstibbs/cloud-core-utils/src/stacks/usage-tracking.js'
import {COUNTRIES_DENY_LIST} from './deploy-envs.js'

const countriesDenyList = COUNTRIES_DENY_LIST.split(',')

const allowedOrigins = [
	'https://tstibbs.github.io', //where the UI actually gets deployed
	'https://trigpointing.uk', //also used from here
	'http://localhost:8080' //for dev testing
]

class DeployStack extends Stack {
	#httpApi

	constructor(scope, id, props) {
		super(scope, id, props)

		new CfnAccount(this, 'agiGatewayAccount', {
			//use a centrally created role so that it doesn't get deleted when this stack is torn down
			cloudWatchRoleArn: Fn.importValue('AllAccountsStack-apiGatewayCloudWatchRoleArn')
		})

		this.#httpApi = new HttpApi(this, 'httpApi', {
			apiName: `${Aws.STACK_NAME}-httpApi`,
			corsPreflight: {
				allowMethods: [CorsHttpMethod.GET],
				allowOrigins: allowedOrigins
			}
		})
		addUsageTrackingToHttpApi(this.#httpApi, 'httpApiAccessLogs')
		this.#addHttpRoute('/integration/trigs/search-parse.php/{searchTerm}', 'search')

		const distribution = buildWebsiteResources(this, 'geoBaggingData', countriesDenyList)
		let httpApiDomain = Fn.select(2, Fn.split('/', this.#httpApi.url))
		distribution.addBehavior('integration/*', new HttpOrigin(httpApiDomain), {
			responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT,
			allowedMethods: AllowedMethods.ALLOW_GET_HEAD, //GET_HEAD is the default, but specifying it here for future compatibility
			viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
			cachePolicy: CachePolicy.CACHING_DISABLED
		})

		applyStandardTags(this)
	}

	#addHttpRoute(path, name) {
		const handler = new NodejsFunction(this, `${name}-handler`, {
			entry: `src/handlers/${name}.js`,
			memorySize: 128,
			timeout: Duration.seconds(30),
			runtime: Runtime.NODEJS_16_X
		})

		let integration = new HttpLambdaIntegration(`${name}-integration`, handler)
		this.#httpApi.addRoutes({
			path: path,
			methods: [HttpMethod.GET],
			integration: integration
		})
	}
}

export {DeployStack}
