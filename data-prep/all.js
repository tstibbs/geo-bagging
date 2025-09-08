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
	'trigs',
	'counties'
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
	const args = process.argv.slice(2)
	if (args.length > 0 && args.at(0) != 'download' && args.at(0) != 'process') {
		console.error('Usage: node all <download|process>')
		process.exit(1)
	}
	const doDownload = args.length == 0 || args.at(0) == 'download'
	const doProcess = args.length == 0 || args.at(0) == 'process'

	const downloaders = await importAll(downloadSources, processor => `./${processor}_download.js`)
	const processors = await importAll(processingSources, processor => `./${processor}.js`)

	let results = {}

	if (doDownload) {
		for (const [name, processor] of downloaders) {
			let result = await single('Downloading', name, processor)
			results[name] = result
		}
		Object.entries(results)
			.filter(([source, result]) => result.status === 'error')
			.forEach(([source, result]) => {
				processors.delete(source)
			})
	}
	if (doProcess) {
		if (!failFast || Object.values(results).filter(result => result.status === 'error').length == 0) {
			//only continue if none of the download have errored
			console.log('')
			console.log('')
			//processing downloaded stuff
			for (const [name, processor] of processors) {
				let result = await single('Processing', name, processor)
				results[name] = result // deliberately overwrite the result for the download
			}
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
