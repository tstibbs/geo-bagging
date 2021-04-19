import dotenv from 'dotenv'

dotenv.config()
let {STACK_NAME} = process.env
if (STACK_NAME == null || STACK_NAME.length == 0) {
	STACK_NAME = 'Default'
}
export {STACK_NAME}
export const {CLIENT_ID, CLIENT_SECRET, COOKIE_SECRET, API_GATEWAY_URL} = process.env
