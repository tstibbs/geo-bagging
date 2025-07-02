import {Duration} from 'aws-cdk-lib'
import {Project, BuildSpec, LinuxBuildImage, ComputeType} from 'aws-cdk-lib/aws-codebuild'
import {Role, ServicePrincipal, ManagedPolicy, PolicyStatement} from 'aws-cdk-lib/aws-iam'
import {Rule, Schedule} from 'aws-cdk-lib/aws-events'
import {CodeBuildProject} from 'aws-cdk-lib/aws-events-targets'
import {Topic} from 'aws-cdk-lib/aws-sns'
import {EmailSubscription} from 'aws-cdk-lib/aws-sns-subscriptions'
import {NOTIFICATION_EMAIL, TRIGS_USERNAME, TRIGS_PASSWORD} from './deploy-envs.js'

export function dataPrepTestBuild(stack) {
	const buildNotificationTopic = new Topic(stack, 'DataPrepTest-BuildNotificationTopic', {
		topicName: 'geobagging-data-prep-test-build-notifications'
	})
	buildNotificationTopic.addSubscription(new EmailSubscription(NOTIFICATION_EMAIL))

	const serviceRole = new Role(stack, 'DataPrepTest-CodeBuildServiceRole', {
		roleName: 'codebuild-geobagging-data-prep-test-build-service-role',
		assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
		managedPolicies: [
			ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
			ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess')
		]
	})
	serviceRole.addToPolicy(
		new PolicyStatement({
			actions: ['sns:Publish'],
			resources: [buildNotificationTopic.topicArn]
		})
	)

	const project = new Project(stack, 'DataPrepTest-CodebuildProject', {
		projectName: 'geobagging-data-prep-test',
		buildSpec: BuildSpec.fromAsset('./src/data-prep-test-build-spec.yaml'),
		environment: {
			buildImage: LinuxBuildImage.AMAZON_LINUX_2_5,
			computeType: ComputeType.SMALL,
			environmentVariables: {
				TRIGS_USERNAME: {value: TRIGS_USERNAME},
				TRIGS_PASSWORD: {value: TRIGS_PASSWORD}
			}
		},
		role: serviceRole,
		timeout: Duration.minutes(10),
		queuedTimeout: Duration.hours(8),
		concurrentBuildLimit: 1
	})
	project.notifyOnBuildFailed('DataPrepTest-notify', buildNotificationTopic)

	new Rule(stack, 'DataPrepTest-WeeklyBuildRule', {
		ruleName: 'trigger-geobagging-data-prep-test-build',
		description: 'Triggers the geo-bagging data-prep test build weekly',
		schedule: Schedule.cron({
			minute: '43',
			hour: '2',
			weekDay: 'MON'
		}),
		targets: [new CodeBuildProject(project)]
	})
}
