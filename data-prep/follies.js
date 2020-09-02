import xml2js from 'xml2js'
import {ifCmd, readFile} from './utils.js'
import Converter from './converter.js'
import xslt from './xslt.js'
import {tmpInputDir, outputDir} from './constants.js'

const gardenStructure = 'Garden structure'
const arch = 'Arch_Gateway'
const grotto = 'Grotto'
const tower = 'Tower'
const castle = 'Castle'
const building = 'Building'

const knownTypes = {
	Alcove: gardenStructure,
	Arbour: gardenStructure,
	Temple: gardenStructure,
	Aviary: gardenStructure,
	Gazebo: gardenStructure,
	Hermitage: gardenStructure,
	Pavilion: gardenStructure,
	Pavillion: gardenStructure,
	Mausoleum: gardenStructure,
	Well: gardenStructure,
	Tomb: gardenStructure,
	Seat: gardenStructure,
	Platform: gardenStructure,
	Kiosk: gardenStructure,

	Gate: arch,
	Arch: arch,
	Arches: arch,
	Gateway: arch,
	Gatehouse: arch,

	Grotto: grotto,
	Cave: grotto,

	Tower: tower,
	Twr: tower,
	Obelisk: tower,
	Pagoda: tower,
	Pillar: tower,
	Pyramid: tower,
	Column: tower,
	Chimney: tower,
	Memorial: tower,
	Monument: tower,
	Momument: tower, //spelling mistake?
	Munument: tower, //spelling mistake?
	Stand: tower,

	Castle: castle,
	Fort: castle,

	Abbey: building,
	Church: building,
	Chapel: building,
	Belvedere: building,
	Toll: building,
	Summerhouse: building,
	Rotunda: building,
	Pantheon: building,
	Lodge: building,
	Dairy: building,
	Boathouse: building,
	House: building
}

const attributionString =
	'This file adapted from the Folly Maps (http://www.follies.org.uk/follymaps.htm) with the kind permission of Paul from The Folly Fellowship.'
const columnHeaders = '[Longitude,Latitude,Name,Url,Type,ImageLinks]'

function getTagForName(name) {
	name = name.toLowerCase()
	let found = Object.keys(knownTypes).filter(type =>
		name.includes(type.toLowerCase())
	)

	let realType = null
	if (found.length == 0) {
		realType = 'Other'
	} else {
		let selected = null
		if (found.length > 1) {
			let maxValueIndex = -1
			let selectedArrayIndex = -1
			let maxMatchLength = -1
			found.forEach((type, arrayIndex) => {
				let endIndex = name.lastIndexOf(type.toLowerCase()) + type.length
				let matchLength = type.length
				//get the right-most match, getting the longest if there's multiple
				if (
					endIndex > maxValueIndex ||
					(endIndex == maxValueIndex && matchLength > maxMatchLength)
				) {
					maxValueIndex = endIndex
					selectedArrayIndex = arrayIndex
					maxMatchLength = matchLength
				}
			})
			selected = found[selectedArrayIndex]
		} else {
			selected = found[0]
		}
		realType = knownTypes[selected]
	}
	return realType
}

class FolliesConverter extends Converter {
	constructor(oldGeographLinks) {
		super(attributionString, columnHeaders)
		this._oldGeographLinks = oldGeographLinks
	}

	extractColumns(point) {
		let name = point.name[0]
		let type = getTagForName(name)

		let coordsString = point.coordinates[0]
		coordsString = coordsString.trim()
		let coords = coordsString.split(',')
		let lng = coords[0]
		let lat = coords[1]

		let description = point.description[0]
		description == '' ? '' : description

		let mainLinks = point.link[0].split(' ')
		let mainLink = mainLinks[0]
		let googleRegexInner = 'http.*?googleusercontent.com.*?'
		let googleRegex = new RegExp('"(' + googleRegexInner + ')"', 'g')
		let geographRegexInner = 'http://www.geograph.org.uk.photo.*?'
		let geographRegex = new RegExp('\\((' + geographRegexInner + ')\\)', 'g')
		let googleLinks = this._match(description, googleRegex)
		let geographLinks = this._match(description, geographRegex)
		mainLinks.forEach(mainLinkElem => {
			googleLinks.push.apply(
				googleLinks,
				this._match(mainLinkElem, googleRegex)
			)
			geographLinks.push.apply(
				geographLinks,
				this._match(mainLinkElem, geographRegex)
			)
		})
		//de-dupe
		googleLinks = Array.from(new Set(googleLinks))
		geographLinks = Array.from(new Set(geographLinks))

		let url
		let imageLinks
		if (
			mainLinks.length == 1 &&
			mainLink.match(googleRegexInner) != null &&
			googleLinks.length == 1 &&
			googleLinks[0] == mainLink &&
			geographLinks.length == 1
		) {
			//if the main link is a google link and the only other link is a geograph link, it seems that mostly the google link is just a thumnail of the geograph link.
			url = geographLinks[0]
			imageLinks = []
		} else {
			//otherwise, show all the links in the extra element at the bottom
			imageLinks = googleLinks
			imageLinks.push.apply(imageLinks, geographLinks)
			imageLinks.push.apply(imageLinks, mainLinks)
			imageLinks = Array.from(new Set(imageLinks))
			if (imageLinks.length == 1) {
				url = imageLinks[0]
				imageLinks = []
			} else {
				url = ''
			}
		}

		if (!url.includes('.geograph.') && this._oldGeographLinks[name] != null) {
			console.log(
				`${name}: replaced ${url} with ${this._oldGeographLinks[name]}`
			)
			url = this._oldGeographLinks[name]
		}

		return [lng, lat, name, url, type, imageLinks]
	}
}

const parser = new xml2js.Parser()

async function buildDataFile() {
	let oldRaw = await readFile(`${outputDir}/follies/data.json`)
	let oldGeographLinks = Object.fromEntries(
		JSON.parse(oldRaw)
			.data.filter(row => row[3].includes('.geograph.'))
			.map(row => [row[2], row[3]])
	)
	await xslt('follies-extract.xslt', 'follies/follies.kml', 'follies/out.xml')
	let data = await readFile(`${tmpInputDir}/follies/out.xml`)
	let result = await parser.parseStringPromise(data)
	const converter = new FolliesConverter(oldGeographLinks)
	await converter.writeOutCsv(
		result.points.point,
		`${outputDir}/follies/data.json`
	)
}

ifCmd(import.meta, buildDataFile)

export default buildDataFile
