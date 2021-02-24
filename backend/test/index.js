//just a wrapper to allow running this locally in dev - but app.js is what you'd really use in the serverless function

const https = require('https')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

const router = require('../dist/main.js').handler

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
