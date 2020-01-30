const fs = require('fs');
const wtf = require('wtf_wikipedia');
const xml2js = require('xml2js');
const constants = require('./constants');
const {ifCmd} = require('./utils');
const xslt = require('./xslt');

const xmlParser = new xml2js.Parser();

const inputDir = `${constants.tmpInputDir}/railways`

function download(pageNames) {
	wtf.fetch(pageNames).then(docs => {
		fs.writeFile(`${inputDir}/pages.json`, JSON.stringify(docs, null, 2), function(err) {
			if (err) {
				console.error(err);
			}
		});
	});
}

//TODO download the KML from the parent category page
function buildDataFile() {
	xslt('railways-extract.xslt', 'railways/doc.kml', 'railways/out.xml').then(() => {
		fs.readFile(`${inputDir}/out.xml`, (err, data) => {
			if (err) {
				console.log(err);
			}
			xmlParser.parseString(data, (err, result) => {
				if (err) {
					console.log(err);
				}
				let points = result.points.point;
				let urls = points.map(point => /<br>Source: Wikipedia article <a href="(https:\/\/en.wikipedia.org\/wiki\/[^"]+)">[^<]+<\/a>/.exec(point.description)[1])
				urls = urls.filter(name => (/railway/i.test(name) && !(/station/i.test(name))));
				urls = [...new Set(urls)].sort();
				download(urls);
			});
		});
	});
}

ifCmd(module, buildDataFile)

module.exports = buildDataFile;
