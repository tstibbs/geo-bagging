import {strict as assert} from 'assert'
import {createReadStream} from 'fs'

import aws from 'aws-sdk'

import {STACK_NAME} from '../lib/deploy-envs.js'

const GB_DATA_PATH = 'data'

aws.config.region = 'eu-west-2'
aws.config.apiVersions = {
	s3: '2006-03-01',
	cloudformation: '2010-05-15'
}
let cloudformation = new aws.CloudFormation()
let s3 = new aws.S3()

const args = process.argv.slice(2)
if (args.length < 1) {
	console.error(
		'Usage: node tools/upload.js sourcesToUpload... [including source sub identifier e.g. hills/data hills/data_all'
	)
	process.exit(1)
}
const sourcesToUpload = args

async function getOutputs(stackName) {
	let response = await cloudformation
		.describeStacks({
			StackName: stackName
		})
		.promise()
	assert.equal(response.Stacks.length, 1)
	let outputs = Object.fromEntries(response.Stacks[0].Outputs.map(output => [output.OutputKey, output.OutputValue]))
	return outputs
}

const {bucketName} = await getOutputs(STACK_NAME)

async function upload(prefix, fileName, body, contentType) {
	let key
	if (prefix != null && prefix.length > 0) {
		key = `${prefix}/${fileName}`
	} else {
		key = fileName
	}
	console.log(`Uploading ${key}`)
	let uploadResponse = await s3
		.upload({
			Bucket: bucketName,
			Key: key,
			Body: body,
			ContentType: contentType
		})
		.promise()
	assert.notEqual(uploadResponse.Location, null)
	assert.notEqual(uploadResponse.Location, undefined)
}

for (const source of sourcesToUpload) {
	const mainFileName = `${source}.json`
	const mainFilePath = `../ui/src/js/bundles/${mainFileName}`
	const mainContentStream = createReadStream(mainFilePath)
	await upload(GB_DATA_PATH, mainFileName, mainContentStream, 'application/json')
	const metaFileName = `${mainFileName}.meta`
	const metaFilePath = `${mainFilePath}.meta`
	const metaContentStream = createReadStream(metaFilePath)
	await upload(GB_DATA_PATH, metaFileName, metaContentStream, 'application/octet-stream')
}
