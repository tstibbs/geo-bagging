import util from 'util'
import mapnik from 'mapnik'
import mapnikify from '@mapbox/geojson-mapnikify'
import fs from 'fs'
import assert from 'assert'
import pngjs from 'pngjs'
import pixelmatch from 'pixelmatch'
import {createTempDir, readFile, writeFile, deleteFile} from './utils.js'
import {tmpInputDir, outputDir as sourceDataDir, referenceDataDir} from './constants.js'

// register fonts and datasource plugins
mapnik.register_default_fonts()
mapnik.register_default_input_plugins()

async function visualise(datasource, qualifier) {
	let inputPath = `${qualifier === 'old' ? referenceDataDir : sourceDataDir}/${datasource}/data.geojson`
	let outputDir = `${tmpInputDir}/comparisons/${datasource}`
	await createTempDir(outputDir)
	let outputPath = `${outputDir}/output-${qualifier}.png`
	let geojson = await readFile(inputPath)
	geojson = JSON.parse(geojson)
	//add bounds of the UK so that changes in bounds between the old and new data doesn't affect the scaling of the image (which could otherwise cause false positive differences)
	geojson.features.push({
		type: 'Feature',
		geometry: {
			type: 'MultiLineString',
			coordinates: [
				[
					//bounds of the UK
					[-9.0, 49.75],
					[-9.0, 61.01],
					[2.01, 61.01],
					[2.01, 49.75],
					[-9.0, 49.75]
				]
			]
		}
	})
	let xml = await util.promisify(mapnikify)(geojson, false)
	let outputXmlPath = `${tmpInputDir}/comparisons/${datasource}/tmp-${qualifier}.xml`
	await writeFile(outputXmlPath, xml)
	await toPng(outputXmlPath, outputPath)
}

function toPng(inputXmlPath, outputPngPath) {
	//for some reason these methods don't seem to be promisify-able
	return new Promise((resolve, reject) => {
		let heightWidth = 1000
		let map = new mapnik.Map(heightWidth, heightWidth)
		map.load(inputXmlPath, (err, map) => {
			if (err) reject(err)
			map.zoomAll()
			let im = new mapnik.Image(heightWidth, heightWidth)
			map.render(im, (err, im) => {
				if (err) reject(err)
				im.encode('png', (err, buffer) => {
					if (err) reject(err)
					fs.writeFile(outputPngPath, buffer, err => {
						if (err) reject(err)
						resolve()
					})
				})
			})
		})
	})
}

function readPng(filename) {
	return new Promise((resolve, reject) => {
		let stream = fs
			.createReadStream(filename)
			.pipe(
				new pngjs.PNG({
					filterType: 4
				})
			)
			.on('parsed', data => {
				resolve({data: data, width: stream.width, height: stream.height})
			})
			.on('error', reject)
	})
}

async function compare(datasource) {
	let oldImg = `${tmpInputDir}/comparisons/${datasource}/output-old.png`
	let newImg = `${tmpInputDir}/comparisons/${datasource}/output-new.png`
	let diffFile = `${tmpInputDir}/comparisons/${datasource}/output-diff.png`
	await deleteFile(diffFile)
	let img1 = await readPng(oldImg)
	let img2 = await readPng(newImg)
	assert.equal(img1.height, img2.height, 'height does not match')
	assert.equal(img1.width, img2.width, 'height does not match')

	let mismatchedPixels = 0
	for (let y = 0; y < img1.height; y++) {
		for (let x = 0; x < img1.width; x++) {
			let idx = (img1.width * y + x) * 4

			//idx to idx+3 are: RGBA (one per index)
			if (
				img1.data[idx] != img2.data[idx] ||
				img1.data[idx + 1] != img2.data[idx + 1] ||
				img1.data[idx + 2] != img2.data[idx + 2] ||
				img1.data[idx + 3] != img2.data[idx + 3]
			) {
				mismatchedPixels++
			}
		}
	}
	let matches = mismatchedPixels == 0
	if (!matches) {
		console.log(`${mismatchedPixels} pixels were different (out of 1,000,000).`)
		let {width, height} = img1
		let diff = new pngjs.PNG({width, height})

		pixelmatch(img1.data, img2.data, diff.data, width, height, {
			includeAA: true
		})

		await writeFile(diffFile, pngjs.PNG.sync.write(diff))
		return `mismatched by ${mismatchedPixels}/1,000,000 pixels - please review ${diffFile}`
	} else {
		return null
	}
}

export {visualise, compare}
