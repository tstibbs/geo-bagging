import {ifCmd} from '@tstibbs/cloud-core-utils'

const downloadSources = [
	'defence',
	'hills',
	//'milestones', removed due to outdated source, see note in milestones_download.js
	'trails',
	'follies',
	'rnli',
	'nationalparks',
	'coastallandmarks',
	'nt',
	'trigs'
]
const processingSources = [...downloadSources]

async function importAll(input, namer) {
	let modules = await Promise.all(
		input.map(
			moduleName => import(namer(moduleName)) //returns a promise
		)
	)
	return new Map(modules.map((module, i) => [input[i], module.default]))
}

async function single(action, name, processor) {
	let log = `${action} ${name}`
	console.log(`${log}: started.`)
	try {
		let result = await processor()
		console.log(`${log}: completed.`)
		if (result == null) {
			return {
				status: 'noChanges',
				report: log
			}
		} else {
			return {
				status: 'changes',
				report: `${log}: ${result}`
			}
		}
	} catch (err) {
		console.log(`${log}: errored.`)
		console.log(err)
		let message = err.message ?? err
		return {
			status: 'error',
			report: `${log}: ${message}`
		}
	}
}

export async function run(failFast = true) {
	const downloaders = await importAll(downloadSources, processor => `./${processor}_download.js`)
	const processors = await importAll(processingSources, processor => `./${processor}.js`)

	let results = {}

	for (const [name, processor] of downloaders) {
		let result = await single('Downloading', name, processor)
		results[name] = result
	}
	Object.entries(results)
		.filter(([source, result]) => result.status === 'error')
		.forEach(([source, result]) => {
			processors.delete(source)
		})
	if (!failFast || Object.values(results).filter(result => result.status === 'error').length == 0) {
		//only continue if none of the download have errored
		console.log('')
		console.log('Initial download finished, starting processing.')
		console.log('')
		//processing downloaded stuff
		for (const [name, processor] of processors) {
			let result = await single('Processing', name, processor)
			results[name] = result // deliberately overwrite the result for the download
		}
	}
	let errored = Object.values(results).filter(result => result.status === 'error')
	let changes = Object.values(results).filter(result => result.status === 'changes')
	let noChanges = Object.values(results).filter(result => result.status === 'noChanges')
	const logResults = (message, resultSet) =>
		console.log([message, ...resultSet.map(result => result.report)].join('\n * '))
	console.log('')
	if (noChanges.length > 0) {
		logResults('Sources ran and produced no changes: ', noChanges)
	}
	if (changes.length > 0) {
		logResults('Sources ran but produced diffs to review: ', changes)
	}
	if (errored.length > 0) {
		logResults('Sources errored: ', errored)
		process.exitCode = 1
	}
}

await ifCmd(import.meta, run)
