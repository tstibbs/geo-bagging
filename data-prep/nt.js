import Converter from './converter.js';
import {ifCmd, readFile} from './utils.js';
import {tmpInputDir, outputDir} from './constants.js';

const attributionString = "This file adapted from data available on www.nationaltrust.org.uk which is copyright © National Trust";
const columnHeaders = "[Longitude,Latitude,Id,Name,Link,type,facilities]"

const attributeExcludes = ['fifty-things', 'available-for-weddings']

function getIdsForAspect(values, ) {
    let placeIds = {};
    values.filter(([body, attribute]) => 
        !attributeExcludes.includes(attribute) //This doesn't really add any value as an attribute, so let's just filter it out
    ).forEach(([body, attribute]) => {
        let result = /<script>var nt_searchResultsPlaceIds = \[(\d+(, \d+)*)\]<\/script>/.exec(body);
        if (result == null) {
            console.log('result null');
            console.log(path);
            console.log(body);
            placeIds[attribute] = [];
        } else {
            placeIds[attribute] = result[1].split(', ').map(str => parseInt(str));
        }
    });
    return placeIds;
}

async function buildDataFile() {
    let input = await readFile(`${tmpInputDir}/nt/data.json`)
    let {places, facilities, allData} = JSON.parse(input);
    places = getIdsForAspect(places);
    facilities = getIdsForAspect(facilities);
    let idsByAspect = {
        places: places,
        facilities: facilities
    };
    let aspectsById = {};
    Object.entries(idsByAspect).forEach(([aspect, attributesToIds]) => {
        Object.keys(attributesToIds).forEach(attribute => {
            attributesToIds[attribute].forEach(id => {
                if (aspectsById[id] == null) {
                    aspectsById[id] = {};
                }
                if (aspectsById[id][aspect] == null) {
                    aspectsById[id][aspect] = [];
                }
                aspectsById[id][aspect].push(attribute);
            });
        });
    });
    let data = JSON.parse(allData);
    let csv = Object.entries(data)
        .filter(([id, details]) => details.location != null)
        .map(([id, details]) => [parseInt(id), details])
        .sort((a, b) => a[0] - b[0])
        .map(([id, details]) => {
            function stringVals(id, aspect) {
                if (aspectsById[id] == null || aspectsById[id][aspect] == null) {
                    return 'Other';
                } else {
                    return aspectsById[id][aspect].join(';');
                }
            }
            let type = stringVals(id, 'places');
            let facilities = stringVals(id, 'facilities');
            return [
                details.location.longitude,
                details.location.latitude,
                id,
                details.title,
                details.websiteUrl,
                type,
                facilities
            ];
        });
    let converter = new Converter(attributionString, columnHeaders);
    await converter.writeOutCsv(csv, `${outputDir}/nt/data.json`);
}

ifCmd(import.meta, buildDataFile)

export default buildDataFile;
