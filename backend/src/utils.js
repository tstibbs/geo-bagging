function createHttpMethodFilter(method) {
	return function (delegate) {
		return function (req, res) {
			if (req.method == method) {
				delegate(req, res)
			} else {
				res.status(405).send(`Error 405: Method ${req.method} Not Allowed`)
			}
		}
	}
}

export const get = createHttpMethodFilter('GET')
export const post = createHttpMethodFilter('POST')
export const put = createHttpMethodFilter('PUT')
export const httpDelete = createHttpMethodFilter('DELETE')
export const httpOptions = createHttpMethodFilter('OPTIONS')

export function redirect(req, res, url, statusIfAjax) {
	let ajax = !req.get('Accept').includes('text/html') //we only ever request json using ajax
	if (ajax) {
		if (statusIfAjax != undefined) {
			res.status(statusIfAjax)
		}
		res.end()
	} else {
		res.setHeader('Location', url)
		res.status(302)
		res.end()
	}
}
