import {strict as assert} from 'assert'
import {createReadStream} from 'fs'

import {CloudFormation} from '@aws-sdk/client-cloudformation'
import {Upload} from '@aws-sdk/lib-storage'
import {S3} from '@aws-sdk/client-s3'
import {ifCmd} from '@tstibbs/cloud-core-utils'

import {STACK_NAME} from '../lib/deploy-envs.js'

const GB_DATA_PATH = 'data'

let cloudformation = new CloudFormation({
	region: 'eu-west-2'
})
let s3 = new S3({
	region: 'eu-west-2'
})

async function getOutputs(stackName) {
	let response = await cloudformation.describeStacks({
		StackName: stackName
	})
	assert.equal(response.Stacks.length, 1)
	let outputs = Object.fromEntries(response.Stacks[0].Outputs.map(output => [output.OutputKey, output.OutputValue]))
	return outputs
}

async function upload(bucketName, prefix, fileName, body, contentType) {
	let key
	if (prefix != null && prefix.length > 0) {
		key = `${prefix}/${fileName}`
	} else {
		key = fileName
	}
	console.log(`Uploading ${key}`)
	let uploadResponse = await new Upload({
		client: s3,

		params: {
			Bucket: bucketName,
			Key: key,
			Body: body,
			ContentType: contentType
		}
	}).done()
	assert.notEqual(uploadResponse.Location, null)
	assert.notEqual(uploadResponse.Location, undefined)
}

async function run() {
	const {bucketName} = await getOutputs(STACK_NAME)

	const args = process.argv.slice(2)
	if (args.length < 1) {
		console.error(
			'Usage: node tools/upload.js sourcesToUpload... [including source sub identifier e.g. hills/data.json hills/data_all.json'
		)
		process.exit(1)
	}
	const sourcesToUpload = args

	for (const mainFileName of sourcesToUpload) {
		const mainFilePath = `../ui/src/js/bundles/${mainFileName}`
		const mainContentStream = createReadStream(mainFilePath)
		await upload(bucketName, GB_DATA_PATH, mainFileName, mainContentStream, 'application/json')
		const metaFileName = `${mainFileName}.meta`
		const metaFilePath = `${mainFilePath}.meta`
		const metaContentStream = createReadStream(metaFilePath)
		await upload(bucketName, GB_DATA_PATH, metaFileName, metaContentStream, 'application/octet-stream')
	}
}
await ifCmd(import.meta, run)
