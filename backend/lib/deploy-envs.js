import dotenv from 'dotenv'

dotenv.config()

let {STACK_NAME} = process.env
if (STACK_NAME == null || STACK_NAME.length == 0) {
	STACK_NAME = 'NO-STACK-NAME-PROVIDED' //makes testing slightly easier by not always insisting something is set
}
export {STACK_NAME}

export const {COUNTRIES_DENY_LIST, NOTIFICATION_EMAIL} = process.env
