const cheerio = require('cheerio');
const {ifCmd, get, writeFile, createTempDir} = require('./utils');
const constants = require('./constants');

const allDataPath = 'https://www.nationaltrust.org.uk/search/data/all-places';
const basePath = 'https://www.nationaltrust.org.uk/search?query=&type=place&view=map';
const tmpDir = `${constants.tmpInputDir}/nt`;

async function download() {
    await createTempDir(tmpDir);
    let [body] = await get(basePath);
    let $ = cheerio.load(body);
    let placeTypes = $("input[name='PlaceFilter']").toArray().map(elem => $(elem).attr('value'));
    let facilityTypes = $("input[name='FacilityFilter']").toArray().map(elem => $(elem).attr('value'));
    let places = await getAspect(placeTypes, 'PlaceFilter');
    let facilities = await getAspect(facilityTypes, 'FacilityFilter');
    let [allData] = await get(allDataPath);
    let data = {
        places,
        facilities,
        allData
    }
    let dataString = JSON.stringify(data, null, 2);
	await writeFile(`${tmpDir}/data.json`, dataString);
}

async function getAspect(values, param) {
    let placePromises = values.map(type => 
		get(`${basePath}&${param}=${type}`).then(([body]) =>
            [body, type]
        )
	);
	return await Promise.all(placePromises);
}

ifCmd(module, download)

module.exports = download;
