//just a wrapper to allow running this locally in dev - but app.js is what you'd really use in the serverless function

import https from 'https'
import fs from 'fs'
import express from 'express'
import bodyParser from 'body-parser'
import {validateCdkAssets} from '@tstibbs/cloud-core-utils'
import {STACK_NAME} from '../lib/deploy-envs.js'

const router =
	process.env.USE_BUILT_CODE == 'true'
		? (await validateCdkAssets(STACK_NAME, 1))[0]
		: (await import('../src/app.js')).handler

const app = express()
const port = 3001

app.use(bodyParser.json())
app.get('/*', router)
app.post('/*', router)
app.options('/*', router)

//to generate files, run the following
//openssl req -nodes -new -x509 -keyout server.key -out server.cert

const options = {
	key: fs.readFileSync('tmp/server.key'),
	cert: fs.readFileSync('tmp/server.cert'),
	requestCert: false,
	rejectUnauthorized: false
}

//we need SSL because cross-domain cookies need SameSite=None, but that's ignored unless secure=true, and that requires https
https.createServer(options, app).listen(port, () => console.log(`Test harness listening on https://localhost:${port}.`))
