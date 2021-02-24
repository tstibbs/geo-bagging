import proj4 from 'proj4'
import {visualise as visualiseGeoJson, compare as compareGeoJson} from './geojson-comparer.js'
import Converter from './converter.js'
import {tmpInputDir, outputDir} from './constants.js'
import {ifCmd} from '@tstibbs/cloud-core-utils'
import {backUpReferenceData, writeFile, readFile} from './utils.js'

const inputDirectory = `${tmpInputDir}/trails`

//additional data not included in the input files
const walesNatTrailsDetails = {
	'Glyndwrs Way': {
		name: "Glyndŵr's Way",
		length: '135'
	},
	'Offas Dyke': {
		name: "Offa's Dyke Path",
		length: '177',
		openedDate: '1971-07-10T00:00:00.000Z'
	}
}
const englandCoastPathDetails = {
	name: 'England Coast Path',
	length: '2795 (expected length at completion)',
	notes: 'Completion targetted at 2020.'
}
const walesCoastPathDetails = {
	name: 'Wales Coast Path',
	length: '870',
	openedDate: '2012-05-05T00:00:00.000Z'
}

//set up the projections we support
proj4.defs(
	'urn:ogc:def:crs:EPSG::27700',
	'+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs'
)
proj4.defs('urn:ogc:def:crs:OGC:1.3:CRS84', proj4.defs('EPSG:4326'))

async function parse(fileName, propertiesTransformer, geometryTransformer, filter, allFeaturesTransformer) {
	try {
		let contents = await readFile(`${inputDirectory}/${fileName}`)
		let data = JSON.parse(contents)
		let features = data.features
		if (filter != null) {
			features = features.filter(filter)
		}
		features = features.map(feature => {
			let type = feature.type
			//filter and map properties
			let properties = propertiesTransformer(feature.properties)
			//convert coordinates
			let crs = null
			if (data.crs && data.crs.properties && data.crs.properties.name) {
				crs = data.crs.properties.name
			}
			let geometry = geometryTransformer(crs, feature.geometry)
			//
			return {
				type: type,
				geometry: geometry,
				properties: properties
			}
		})
		if (allFeaturesTransformer != null) {
			features = allFeaturesTransformer(features)
		}
		return features
	} catch (err) {
		//catch and log because proj4 throws poor error messages
		console.error(`error thrown for ${fileName}`)
		console.error(err)
		throw err
	}
}

function crsTransformer(crs, geometry) {
	if (crs != null) {
		let projection = proj4(crs, 'WGS84')
		const multiLineTransformer = elem => {
			return elem.map(projection.forward)
		}
		const lineStringTransformer = projection.forward
		const transformers = {
			MultiLineString: multiLineTransformer,
			LineString: lineStringTransformer
		}
		let geoType = geometry.type
		let transformer = transformers[geoType]
		geometry.coordinates = geometry.coordinates.map(transformer)
	}
	return geometry
}

function combineReducer(features) {
	let combined = features.reduce((output, feature) => {
		if (output == null) {
			output = feature
			if (output.geometry.type == 'LineString') {
				output.geometry.type = 'MultiLineString'
				output.geometry.coordinates = [output.geometry.coordinates]
			}
		} else {
			if (feature.geometry.type == 'LineString') {
				output.geometry.coordinates.push(feature.geometry.coordinates)
			} else if (feature.geometry.type == 'MultiLineString') {
				output.geometry.coordinates = output.geometry.coordinates.concat(feature.geometry.coordinates)
			} else {
				throw new Error('Unhandled geometry type.')
			}
		}
		return output
	}, null)
	return [combined]
}

async function buildDataFile() {
	await backUpReferenceData('trails', 'data.geojson')
	let pEngNatTrails = parse(
		'National_Trails_England.geojson',
		properties => {
			return {
				openedDate: properties['Opened'],
				length: properties['Length_Mil'],
				name: properties['Name']
			}
		},
		(crs, geometry) => {
			return geometry
		},
		feature => {
			return feature.properties['Name'] != "Offa's Dyke Path"
		}
	)

	let pWelshNatTrails = parse(
		'WalesNationalTrails.json',
		properties => {
			let name = properties['NAME'].trim()
			let extraProps = walesNatTrailsDetails[name]
			return Object.assign({name}, extraProps)
		},
		crsTransformer,
		feature => {
			let name = feature.properties['NAME']
			return name != null && name.trim() != 'Pembrokeshire'
		}
	)

	let pEnglandCoastPath = parse(
		'England_Coast_Path_Route.geojson',
		() => englandCoastPathDetails,
		crsTransformer,
		feature => {
			return feature.properties['Alt_Route'].trim() == 'No'
		},
		features => {
			return combineReducer(features)
		}
	)

	let pWalesCoastPath = parse(
		'WalesCoastPath.json',
		() => walesCoastPathDetails,
		crsTransformer,
		feature => {
			let status = feature.properties['STATUS']
			return status != null && status.trim() == 'Main'
		},
		features => {
			return combineReducer(features)
		}
	)

	let allTransformed = await Promise.all([pEngNatTrails, pWelshNatTrails, pEnglandCoastPath, pWalesCoastPath])
	let allFeatures = allTransformed.reduce((allFeatures, fileFeatures) => [...allFeatures, ...fileFeatures], [])
	let totalFeatures = allFeatures.length
	let output = {
		type: 'FeatureCollection',
		features: allFeatures,
		totalFeatures: totalFeatures
	}
	const fileName = `${outputDir}/trails/data.geojson`
	await writeFile(fileName, JSON.stringify(output), 'utf-8')
	await visualiseGeoJson('trails', 'old')
	await visualiseGeoJson('trails', 'new')
	let comparisonResult = await compareGeoJson('trails')

	const converter = new Converter()
	let lastUpdated = converter.getLastUpdatedString()
	await converter.writeMetaData(fileName, totalFeatures, lastUpdated)

	return comparisonResult
}

await ifCmd(import.meta, buildDataFile)

export default buildDataFile
