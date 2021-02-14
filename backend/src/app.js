import modofun from 'modofun'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import {get, post, sendEmptyResponse} from './utils.js'
import {appRedirectUrls, loginRoute} from './constants.js'
import {wrapper, isAuthenticated, login, success, intialClientUrls} from './google-oauth.js'
import {middleware as authMiddleware, errorHandler as authErrorHandler, logout} from './auth.js'
import {recordVisit, removeVisit, listVisits} from './visits.js'
import {isAWS} from './envs.js'

const isAuthenticatedRoute = 'isAuthenticated'

const corsOptions = {
	origin: [undefined, ...Object.keys(appRedirectUrls), ...Object.keys(intialClientUrls)], //allow direct calls for dev and testing
	credentials: true,
	allowedHeaders: ['Content-Type', 'Cookie']
}

const handleListVisits = get(
	wrapper(async (userClient, req, res) => {
		let files = await listVisits(userClient, req.query.source)
		res.json(files)
	})
)
const handleRecordVisit = post(
	wrapper(async (userClient, req, res) => {
		await recordVisit(userClient, req.body.source, req.body.name)
		sendEmptyResponse(res, 201)
	})
)
const handleRemoveVisit = post(
	wrapper(async (userClient, req, res) => {
		await removeVisit(userClient, req.body.source, req.body.name)
		sendEmptyResponse(res, 204)
	})
)
const handleLogout = get(
	wrapper(async (userClient, req, res) => {
		logout(req, res)
		sendEmptyResponse(res, 204)
	})
)

let router = modofun(
	{
		[isAuthenticatedRoute]: isAuthenticated,
		[loginRoute]: login,
		logout: handleLogout,
		success,
		listVisits: handleListVisits,
		recordVisit: handleRecordVisit,
		removeVisit: handleRemoveVisit
	},
	{
		mode: 'reqres',
		middleware: [
			cors(corsOptions),
			cookieParser(),
			authMiddleware.unless(req => req.path.endsWith(loginRoute)),
			authErrorHandler
		]
	}
)

let handler = router

if (isAWS) {
	let wrap = (description, delegate) => {
		return (...args) => {
			console.log(`${description}:\n${JSON.stringify(args, null, 2)}`)
			delegate(...args)
		}
	}
	handler = (event, context, callback) => {
		router(event, context, wrap('Modofun returning', callback))
		return
	}
}

export {handler}
