const request = require('request');

function get(path) {
	return new Promise((resolve, reject) => {
		request(path, (error, response, body) => {
			if (error) {
				reject(error);
			} else {
				resolve([body, path]);
			}
		});
	});
}

module.exports.get = get;
