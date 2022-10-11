import axios from 'axios'

//takes a URL like this: /trigs/search-parse.php/TP25346
//and redirects to a URL like this: https://trigpointing.uk/trigs/view-trigs.php?q=2736479
//this exists simply because the actual website redirects to http, this makes it https which allows it to be used via cors from an https origin, without being blocked by the mixed origin policy
export async function handler(event) {
	console.log(JSON.stringify({event}, null, 2))
	let searchToken = event.requestContext.http.path.split('/').slice(-1)
	if (searchToken == null || searchToken.length == 0) {
		throw new Error(`BadRequest: 'trig' parameter must be specified`)
	}
	let location = await makeRequest(searchToken)

	let response = {
		//the page we're redirecting to will not have coors to set up to allow redirections from this origin, so instead do the redirection client-side.
		redirectTo: location
	}
	console.log('returning:')
	console.log(JSON.stringify(response, null, 2))
	return response
}

async function makeRequest(searchToken) {
	let sanitizedToken = encodeURIComponent(searchToken) //should be equivelent, but just in case someone is trying to do something weird
	const tukResponse = await axios({
		url: `https://trigpointing.uk/trigs/search-parse.php?trig=${sanitizedToken}`,
		validateStatus: status => (status >= 200 && status < 300) || status == 302,
		maxRedirects: 0
	})

	let {status, headers} = tukResponse
	if (status != 302) {
		throw new Error(`Status was unexpectedly ${status}`)
	}
	let location = headers['location']
	location = location.replace(/^http:\/\//, 'https://')
	return location
}
