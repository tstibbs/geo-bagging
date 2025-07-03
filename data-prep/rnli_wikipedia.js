import {ifCmd} from '@tstibbs/cloud-core-utils'
import {readFile} from './utils.js'
import {tmpInputDir} from './constants.js'

const inputDir = `${tmpInputDir}/rnli`
const validLaunchMethods = [
	'MooredAfloat',
	'Carriage',
	'FloatingHouse',
	'Transporter',
	'Davit',
	'Launchway',
	'Slipway',
	'Unknown'
]

const flatten = arrays => {
	return [].concat.apply([], arrays)
}

function removeIgnoredTypes(types, launchMethods) {
	const ignoredTypes = ['RescueWaterCraft']
	let occurrences = ignoredTypes.map(ignoredType => types.indexOf(ignoredType)).filter(occurrence => occurrence != -1)
	if (occurrences.length > 0 && types.length != launchMethods.length) {
		console.error(
			`ignoredTypes detected, which requires types and launchMethods to map one-to-one, but they don't: "${types}" "${launchMethods}"`
		)
	}
	occurrences.forEach(occurrence => {
		//splice happens *in place*
		types.splice(occurrence, occurrence)
		launchMethods.splice(occurrence, occurrence)
	})
	launchMethods.forEach(method => {
		if (!validLaunchMethods.includes(method)) {
			throw new Error(`${method} is not a valid launch method.`)
		}
	})
	return {
		types,
		launchMethods
	}
}

async function convertWikiData() {
	let data = await readFile(`${inputDir}/wiki.json`)
	let docs = JSON.parse(data)
	let tables = [].concat(
		...docs.map(doc => flatten(doc.sections.map(section => section.tables).filter(tables => tables != null)))
	)
	let stations = tables
		.reduce((allStations, division) => {
			let divisionStations = division.map(station => {
				let typesString = station['Lifeboat type(s)'].text
				let launchString = station['Launch method'].text
				let possibleTypes = parseTypes(typesString)
				let possibleLaunchMethods = parseLaunchMethods(launchString)
				let {types, launchMethods} = removeIgnoredTypes(possibleTypes, possibleLaunchMethods)
				let name = parseStation(station['Station'].text)
				return {
					types,
					name,
					launchMethods
				}
			})
			return allStations.concat(divisionStations)
		}, [])
		.reduce((stationsByName, station) => {
			stationsByName[station.name] = {
				types: station.types,
				launchMethods: station.launchMethods
			}
			return stationsByName
		}, {})

	return stations
}

function parseStation(stationText) {
	if (/{{Lbs\|(.*)}}/.test(stationText)) {
		stationText = stationText.match(/{{Lbs\|(.*)}}/)[1]
	}

	// just some basic but very specific replacements to make it match up with the rnli data
	let replacements = [
		['Berwick-upon-Tweed', 'Berwick Upon Tweed'],
		['Dún Laoghaire', 'Dun Laoghaire'],
		['Saint Peter Port', 'St Peter Port'],
		['Red Bay', 'Red bay'],
		['Wells-next-the-Sea', 'Wells']
	]
	return replace(stationText, replacements).trim().toLowerCase()
}

function parseTypes(typesString) {
	let replacements = [
		['Atlantic 75', 'Atlantic75'],
		['Atlantic 85', 'Atlantic85'],
		['Shannon Class', 'Shannon'],
		['Arancia IRB \\(A-76\\)', 'Arancia'],
		['Tamar-class', 'Tamar'],
		['Tyne-class', 'Tyne'],
		['H\\-class', 'H'],
		['E\\-class Mk\\d', 'E'],
		['E\\-class', 'E'],
		['D\\-class \\(IB1\\)', 'D'],
		['D\\-class', 'D'],
		['Rescue WaterCraft', 'RescueWaterCraft'],
		['Rescue Water Craft', 'RescueWaterCraft']
	]
	return multiReplace(typesString, replacements)
}

function stripPrefixes(launchString) {
	//some entries such as 'carrybridge' have helpfully prefixed the launch method so you know which type it refers to
	const prefixCheck = /\b\w\w\w\s?- ([^\s]+)\b/g
	if (prefixCheck.test(launchString)) {
		launchString = launchString.replace(prefixCheck, '$1')
	}
	return launchString
}

function parseLaunchMethods(launchString) {
	launchString = stripPrefixes(launchString)
	let replacements = [
		['Moored afloat', 'MooredAfloat'],
		['Moored alongside', 'MooredAfloat'],
		['Aquadock', 'MooredAfloat'],
		['Versadock', 'MooredAfloat'],
		['Tetradock', 'MooredAfloat'],
		['Floating house', 'FloatingHouse'],
		['Floating Boathouse', 'FloatingHouse'],
		['Mobile davit', 'Transporter'],
		['Lorry-mounted davit', 'Transporter'],
		['Floating cradle', 'Carriage'],
		['Carriageway', 'Carriage'],
		['A85 Carriage', 'Carriage'],
		['SLARS', 'Carriage']
	]
	return multiReplace(launchString, replacements)
}

function multiReplace(input, replacements) {
	let things = replace(input, replacements).split(/\s+/)
	return things
}

function replace(input, replacements) {
	return replacements
		.reduce((result, [regex, replacement]) => result.replace(new RegExp(regex, 'gi'), replacement), input)
		.trim()
}

await ifCmd(import.meta, convertWikiData)

export {convertWikiData}
