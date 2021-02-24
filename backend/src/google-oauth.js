import {google as googleapi} from 'googleapis'

import {persistSession} from './auth.js'
import {get, redirect} from './utils.js'
import {appRedirectUrls, allowedOauthRedirectUris, allowedOauthOrigins, oauthScopes} from './constants.js'
import {oauthClientId, oauthClientSecret} from './envs.js'

const OAuth2 = googleapi.auth.OAuth2

const intialClients = {}
allowedOauthRedirectUris.forEach(redirectUrl => {
	let origin = allowedOauthOrigins.find(origin => redirectUrl.includes(`://${origin}/`))
	if (origin != undefined) {
		intialClients[origin] = new OAuth2(oauthClientId, oauthClientSecret, redirectUrl)
	}
})

const persistSessionLogin = async (req, res, origin, redirectUrl) => {
	let payload = {
		origin,
		redirectUrl
	}
	await persistSession(req, res, payload)
}
const persistSessionSuccess = async (req, res, token) => {
	let payload = {
		token
	}
	await persistSession(req, res, payload)
}

const wrapper = delegate => {
	return async (req, res) => {
		try {
			if (req.session.token == null) {
				res.status(401).end()
			} else {
				let userClient = new OAuth2()
				userClient.setCredentials(req.session.token)
				await delegate(userClient, req, res)
			}
		} catch (e) {
			console.error(e)
			res.status(500).end()
		}
	}
}

const isAuthenticated = get(async (req, res) => {
	if (
		req.session == null ||
		req.session.token == null ||
		req.session.token.access_token == null ||
		req.session.origin == null
	) {
		res.json(false)
	} else {
		let tokenInfo = await intialClients[req.session.origin].getTokenInfo(req.session.token.access_token)
		if (tokenInfo == null) {
			res.json(false)
		} else {
			let expiryMillis = tokenInfo.expiry_date
			let expiryDate = new Date(expiryMillis)
			expiryDate.setMinutes(expiryDate.getMinutes() - 5)
			if (Date.now() < expiryDate.getTime()) {
				//i.e. less than 5 minutes of our auth left (out of the usual hour), treat as not authenticated
				res.json({email: tokenInfo.email})
			} else {
				res.json(false)
			}
		}
	}
})

const login = get(async (req, res) => {
	let referer = req.headers.referer
	let redirectUrl = undefined
	if (referer != undefined) {
		let appRedirectUrl = Object.entries(appRedirectUrls).find(([baseUrl, redirect]) => referer.startsWith(baseUrl))
		if (appRedirectUrl != null) {
			redirectUrl = appRedirectUrl[1]
		}
	}

	let host = req.headers.host
	if (!(host in intialClients)) {
		let origin = allowedOauthOrigins.find(origin => origin.includes(host))
		if (origin != undefined) {
			host = origin
		}
	}
	if (!(host in intialClients)) {
		//i.e. if we still haven't found a valid origin
		res.status(401).send(`"${host}" not an allowed origin.`)
	} else {
		await persistSessionLogin(req, res, host, redirectUrl)
		let initialAuthClient = intialClients[host]
		if (initialAuthClient == undefined) {
			//should never really happen
			console.error(`referer=${referer}, req.headers.host=${req.headers.host}, host=${host}`)
		}
		const url = buildAuthUrl(initialAuthClient)
		redirect(req, res, url, 400)
	}
})

const success = get(async (req, res) => {
	if (req.query.error) {
		res.send(req.query.error)
	} else {
		let code = req.query.code
		try {
			let tokenClient = intialClients[req.session.origin]
			if (tokenClient == null) {
				throw new Error(`tokenClient not found for origin ${req.session.origin}`)
			}
			let token = await handleToken(tokenClient, code)
			await persistSessionSuccess(req, res, token)
			let redirUrl = req.session.redirectUrl
			if (redirUrl != null) {
				redirect(req, res, redirUrl, 400)
			} else {
				res.status(200).end()
			}
		} catch (e) {
			console.error(e)
			res.status(500).end()
		}
	}
})

function buildAuthUrl(initialAuthClient) {
	//use the referrer to find the right origin and then pass the right redirect url. Possibly cache the initial client objects?
	return initialAuthClient.generateAuthUrl({
		scope: oauthScopes
	})
}

async function handleToken(tokenClient, code) {
	//probably doesn't matter if we use one configured with the right redirect url or not in this case
	let res = await tokenClient.getToken(code)
	return res.tokens
}

export const intialClientUrls = Object.keys(intialClients)
export {wrapper, isAuthenticated, login, success}
