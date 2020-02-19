const util = require('util');
const mapnik = require('mapnik');
const mapnikify = require('@mapbox/geojson-mapnikify');
const fs = require('fs');
const assert = require('assert');
const {PNG} = require('pngjs');
const pixelmatch = require('pixelmatch');
const {createTempDir, readFile, writeFile, deleteFile} = require('./utils');

// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

async function visualise(datasource, qualifier) {
    let outputDir = `tmp-input/comparisons/${datasource}`;
    await createTempDir(outputDir);
    let outputPath = `${outputDir}/output-${qualifier}.png`;
    let geojson = await readFile(`../js/bundles/${datasource}/data.geojson`);
    geojson = JSON.parse(geojson);
    let xml = await util.promisify(mapnikify)(geojson, false);
    let outputXmlPath = `tmp-input/comparisons/${datasource}/tmp.xml`
    await writeFile(outputXmlPath, xml);
    await toPng(outputXmlPath, outputPath);
}

function toPng(inputXmlPath, outputPngPath) {
    //for some reason these methods don't seem to be promisify-able
    return new Promise((resolve, reject) => {
        let heightWidth = 1000;
        let map = new mapnik.Map(heightWidth, heightWidth);
        map.load(inputXmlPath, (err, map) => {
            if (err) reject(err);
            map.zoomAll();
            let im = new mapnik.Image(heightWidth, heightWidth);
            map.render(im, (err, im) => {
                if (err) reject(err);
                im.encode('png', (err, buffer) => {
                    if (err) reject(err);
                    fs.writeFile(outputPngPath, buffer, (err) => {
                        if (err) reject(err);
                        resolve();
                    });
                });
            });
        });
    });
}

function readPng(filename) {
    return new Promise((resolve, reject) => {
        let stream = fs.createReadStream(filename)
            .pipe(new PNG({
                filterType: 4
            }))
            .on('parsed', data => {
                resolve({ data: data, width: stream.width, height: stream.height });
            }).on('error', reject);
    });
}

async function compare(datasource) {
    let oldImg = `tmp-input/comparisons/${datasource}/output-old.png`;
    let newImg = `tmp-input/comparisons/${datasource}/output-new.png`;
    let diffFile = `tmp-input/comparisons/${datasource}/output-diff.png`;
    await deleteFile(diffFile);
    let img1 = await readPng(oldImg);
    let img2 = await readPng(newImg);
    assert.equal(img1.height, img2.height, "height does not match");
    assert.equal(img1.width, img2.width, "height does not match");

    let mismatchedPixels = 0;
    for (let y = 0; y < img1.height; y++) {
        for (let x = 0; x < img1.width; x++) {
            let idx = (img1.width * y + x) * 4;

            //idx to idx+3 are: RGBA (one per index)
            if (img1.data[idx] != img2.data[idx]
                || img1.data[idx + 1] != img2.data[idx + 1]
                || img1.data[idx + 2] != img2.data[idx + 2]
                || img1.data[idx + 3] != img2.data[idx + 3]) {
                mismatchedPixels++;
            }
        }
    }
    let matches = (mismatchedPixels == 0);
    if (!matches) {
        console.log(`${mismatchedPixels} pixels were different (out of 1,000,000).`);
        let { width, height } = img1;
        let diff = new PNG({ width, height });

        pixelmatch(img1.data, img2.data, diff.data, width, height, { includeAA: true });

        await writeFile(diffFile, PNG.sync.write(diff));
    }
}

module.exports = {
    visualise,
    compare
}
