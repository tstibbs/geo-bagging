import {ifCmd} from '@tstibbs/cloud-core-utils'

const downloadSources = [
	'defence',
	'hills',
	//'milestones', removed due to outdated source, see note in milestones_download.js
	'trails',
	'follies',
	// 'rnli', //temporarily removed due to changes in the data source we use
	'nationalparks'
	// 'coastallandmarks', //temporarily removed due to changes in the data source we use
	// 'nt' //temporarily removed due to changes in the data source we use
]
const processingSources = [
	...downloadSources,
	//processing manually downloaded stuff
	'trigs'
]

async function importAll(input, namer) {
	let modules = await Promise.all(
		input.map(
			moduleName => import(namer(moduleName)) //returns a promise
		)
	)
	return new Map(modules.map((module, i) => [input[i], module.default]))
}

async function single(action, name, processor) {
	console.log(`${action} ${name}: started.`)
	try {
		let result = await processor()
		console.log(`${action} ${name}: completed.`)
		return result == null ? null : `${action} ${name}: ${result}`
	} catch (err) {
		console.log(`${action} ${name}: errored.`)
		console.log(err)
		return `${action} ${name}`
	}
}

async function run() {
	const downloaders = await importAll(downloadSources, processor => `./${processor}_download.js`)
	const processors = await importAll(processingSources, processor => `./${processor}.js`)

	let errored = []

	for (const [name, processor] of downloaders) {
		let errorInfo = await single('Downloading', name, processor)
		if (errorInfo !== null) {
			errored.push(errorInfo)
		}
	}
	if (errored.length == 0) {
		//only continue if none of the download have errored
		console.log('')
		console.log('Initial download finished, starting processing.')
		console.log('')
		//processing downloaded stuff
		for (const [name, processor] of processors) {
			let errorInfo = await single('Processing', name, processor)
			if (errorInfo !== null) {
				errored.push(errorInfo)
			}
		}
	}
	if (errored.length > 0) {
		console.log('')
		console.log(['Some things errored: ', ...errored].join('\n * '))
		process.exit(1)
	}
}

await ifCmd(import.meta, run)
