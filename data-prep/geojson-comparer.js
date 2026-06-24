import {readFile, writeFile} from 'node:fs/promises'
import fs from 'fs'
import assert from 'assert'
import pngjs from 'pngjs'
import {ifCmd} from '@tstibbs/cloud-core-utils'

import {createTempDir, deleteFile} from './utils.js'
import {tmpInputDir, outputDir as sourceDataDir, referenceDataDir} from './constants.js'
import {gbBoundsAsGeoJson} from './utils/bounds.js'
import {geojsonToPng} from './geojson-visualiser.js'

async function visualise(datasource, qualifier) {
	let inputPath = `${qualifier === 'old' ? referenceDataDir : sourceDataDir}/${datasource}/data.geojson`
	let outputDir = `${tmpInputDir}/comparisons/${datasource}`
	await createTempDir(outputDir)
	let pngPath = `${outputDir}/output-${qualifier}.png`
	let csvPath = `${outputDir}/output-${qualifier}.csv`
	let geojson = await readFile(inputPath)
	geojson = JSON.parse(geojson)
	await storePropertiesToCsv(geojson, csvPath)
	await geojsonToPng(geojson, pngPath)
}

async function storePropertiesToCsv(geojson, csvPath) {
	let metaProps = geojson.properties ?? {}
	let metaHeader = JSON.stringify(Object.keys(metaProps))
	let metaRow = JSON.stringify(Object.values(metaProps))
	let allProps = geojson.features.map(feature => feature.properties)
	let propNames = [...new Set(allProps.flatMap(props => Object.keys(props)))]
	let headerRow = JSON.stringify(propNames)
	let rows = allProps.map(props => JSON.stringify(propNames.map(name => props[name])))
	let csv = [metaHeader, metaRow, headerRow, ...rows].join('\n')
	await writeFile(csvPath, csv)
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

function isWhite(buffer, idx) {
	return buffer[idx] == 255 && buffer[idx + 1] == 255 && buffer[idx + 2] == 255
}

function isTransparent(buffer, idx) {
	return buffer[idx + 3] == 0
}

function setPixel(buffer, idx, r, g, b, a) {
	buffer[idx] = r
	buffer[idx + 1] = g
	buffer[idx + 2] = b
	buffer[idx + 3] = a
}

async function compare(datasource) {
	let errors = []

	let oldCsvFile = `${tmpInputDir}/comparisons/${datasource}/output-old.csv`
	let newCsvFile = `${tmpInputDir}/comparisons/${datasource}/output-new.csv`
	let oldCsv = (await readFile(oldCsvFile)).toString()
	let newCsv = (await readFile(newCsvFile)).toString()
	if (oldCsv != newCsv) {
		errors.push(`Properties differ: ${oldCsvFile}, ${newCsvFile}`)
	}

	let oldImg = `${tmpInputDir}/comparisons/${datasource}/output-old.png`
	let newImg = `${tmpInputDir}/comparisons/${datasource}/output-new.png`
	let diffFile = `${tmpInputDir}/comparisons/${datasource}/output-diff.png`
	await deleteFile(diffFile)
	let img1 = await readPng(oldImg)
	let img2 = await readPng(newImg)
	assert.equal(img1.height, img2.height, 'height does not match')
	assert.equal(img1.width, img2.width, 'height does not match')

	let diffData = Buffer.from(img1.data)
	let mismatchedPixels = 0
	for (let y = 0; y < img1.height; y++) {
		for (let x = 0; x < img1.width; x++) {
			let idx = (img1.width * y + x) * 4
			//idx to idx+3 are: RGBA (one per index)

			const img1Blank = isWhite(img1.data, idx) || isTransparent(img1.data, idx)
			const img2Blank = isWhite(img2.data, idx) || isTransparent(img2.data, idx)
			if (img1Blank && !img2Blank) {
				//added: green
				setPixel(diffData, idx, 0, 255, 0, 255)
				mismatchedPixels++
			} else if (!img1Blank && img2Blank) {
				//removed: red
				setPixel(diffData, idx, 255, 0, 0, 255)
				mismatchedPixels++
			} else if (!img1Blank && !img2Blank) {
				//changed aka the point was coloured in both images - set to standard grey colour
				setPixel(diffData, idx, 220, 220, 220, 255)
			} else {
				//blank in both - set to white for easy contrast
				setPixel(diffData, idx, 255, 255, 255, 255)
			}
		}
	}
	let matches = mismatchedPixels == 0
	if (!matches) {
		let {width, height} = img1
		let diff = new pngjs.PNG({width, height})
		diff.data = diffData
		await writeFile(diffFile, pngjs.PNG.sync.write(diff))
		errors.push(`mismatched by ${mismatchedPixels}/1,000,000 pixels - please review ${diffFile}`)
	}
	if (errors.length > 0) {
		errors.map(error => console.log(error))
		return errors.join('; ')
	} else {
		return null
	}
}

async function run() {
	const args = process.argv.slice(2)
	if (args.length != 1 || args[0] == null) {
		console.log('Usage: node geojson-comparer.js source-name')
		process.exit(1)
	}
	let sourceName = args[0]
	await visualise(sourceName, 'old')
	await visualise(sourceName, 'new')
	await compare(sourceName)
}

await ifCmd(import.meta, run)

export {visualise, compare}
