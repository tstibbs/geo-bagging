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

function doIfCmdCall(module, doit) {
	//execute if run from command line
	if (!module.parent) {
		doit();
	}
}

module.exports.get = get;
module.exports.doIfCmdCall = doIfCmdCall;
