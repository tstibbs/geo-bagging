import cookie from 'cookie'
import expressJwt from 'express-jwt'
import jwt from 'jsonwebtoken'
import util from 'util'

import {redirect} from './utils.js'
import {loginRoute} from './constants.js'
import {cookieSecret} from './envs.js'
const sign = util.promisify(jwt.sign)

const cookieName = 'session'
const algorithm = 'HS512'
const cookieMaxAge = 6 * 60 * 60 //6 hours
const removeCookieExpirationDate = new Date(0)

function setCookie(res, name, value, options = {}) {
	let cookieOptions = {
		httpOnly: true,
		maxAge: cookieMaxAge,
		sameSite: 'None',
		secure: true,
		path: '/',
		...options
	}
	let cookieValue = cookie.serialize(name, String(value), cookieOptions)
	res.setHeader('Set-Cookie', cookieValue)
}

async function persistSession(req, res, payload) {
	let current = req.session || {}
	payload = Object.assign({}, payload, current)
	let token = await sign(payload, cookieSecret, {algorithm: algorithm})
	setCookie(res, cookieName, token)
}

function getToken(req) {
	if (req.cookies && req.cookies[cookieName]) {
		return req.cookies[cookieName]
	} else {
		return null
	}
}

const middleware = expressJwt({
	secret: cookieSecret,
	algorithms: [algorithm],
	getToken: getToken,
	requestProperty: 'session'
})

function errorHandler(err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		redirect(req, res, loginRoute, 401)
	}
}

function logout(req, res) {
	setCookie(res, cookieName, '', {
		expires: removeCookieExpirationDate
	})
}

export {middleware, persistSession, errorHandler, logout}
