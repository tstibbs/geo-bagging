import {apiGatewayUrl} from './envs.js'

export const loginRoute = 'login'

export const appRedirectUrls = {
	'https://tstibbs.github.io': 'https://tstibbs.github.io/geo-bagging/',
	'http://localhost:3000': 'http://localhost:3000'
}

export const allowedOauthRedirectUris = [`https://${apiGatewayUrl}/prod/success`, 'https://localhost:3001/success']

export const allowedOauthOrigins = [apiGatewayUrl, 'localhost:3001']

export const oauthScopes = ['https://www.googleapis.com/auth/drive.appdata', 'email']
