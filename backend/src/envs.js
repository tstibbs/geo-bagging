import dotenv from 'dotenv'
dotenv.config()

export const oauthClientId = process.env.CLIENT_ID
export const oauthClientSecret = process.env.CLIENT_SECRET
export const cookieSecret = process.env.COOKIE_SECRET
export const isAWS = process.env.AWS_LAMBDA_FUNCTION_NAME != undefined
export const apiGatewayUrl = process.env.API_GATEWAY_URL //e.g. e1fg6h48jk.execute-api.eu-west-2.amazonaws.com
