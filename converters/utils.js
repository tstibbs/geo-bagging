const request = require('request');
const util = require("util");
const fs = require('fs');

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


module.exports.readFile = util.promisify(fs.readFile);
module.exports.writeFile = util.promisify(fs.writeFile);
module.exports.readdir = util.promisify(fs.readdir);

module.exports.get = get;
module.exports.ifCmd = doIfCmdCall;
