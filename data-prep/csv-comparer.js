import _ from 'underscore'
import geolib from 'geolib'

import {readFile} from './utils.js'

const HEADER_LNG = 'Longitude'
const HEADER_LAT = 'Latitude'
const INTERESTING_FIELDS = ['Name', 'Link', 'Url']

const NONE = Symbol('NONE')
const SIGNIFICANT = Symbol('SIGNIFICANT')
const INSIGNIFICANT = Symbol('INSIGNIFICANT')
const MUTATION_DESCRIPTORS = [NONE, SIGNIFICANT, INSIGNIFICANT]

async function read(path, indexId) {
	let raw = await readFile(path)
	let contents = JSON.parse(raw)
	let headers = contents.headers.replace('[', '').replace(']', '').split(',')
	let indexLng = headers.indexOf(HEADER_LNG)
	let indexLat = headers.indexOf(HEADER_LAT)
	let interestingFieldIndexes = INTERESTING_FIELDS.map(field => headers.indexOf(field))
		.filter(index => index != null)
		.filter(index => index != indexId)
	let attribution = contents.attribution
	let data = contents.data.sort((a, b) => String(a[indexId]).localeCompare(String(b[indexId])))
	return {
		data,
		indexLng,
		indexLat,
		headers,
		attribution,
		interestingFieldIndexes
	}
}

function checkUniqueness(data, indexId) {
	let all = data.map(row => row[indexId])
	let uniques = _.uniq(all)
	if (all.length !== uniques.length) {
		console.log(`Keys not unique: ${all.length - uniques.length} are duplicates`)
	}
}

function filterOut(row, ...indexes) {
	return row.filter((elem, i) => !indexes.includes(i))
}

function filterIn(row, ...indexes) {
	return row.filter((elem, i) => indexes.includes(i))
}

function compareSimilarRow(oldRow, newRow, indexLng, indexLat, indexId, interestingFieldIndexes) {
	let oldLng = oldRow[indexLng]
	let oldLat = oldRow[indexLat]
	let newLng = newRow[indexLng]
	let newLat = newRow[indexLat]

	let distance = geolib.getDistance({latitude: oldLat, longitude: oldLng}, {latitude: newLat, longitude: newLng})
	let locationChange
	if (distance >= 10) {
		locationChange = SIGNIFICANT
	} else if (`${oldLng}` !== `${newLng}` || `${oldLat}` !== `${newLat}`) {
		//string compare to avoid floating-point dodgyness
		locationChange = INSIGNIFICANT
	} else {
		locationChange = NONE
	}

	let dataChange
	if (!_.isEqual(filterIn(oldRow, interestingFieldIndexes), filterIn(newRow, interestingFieldIndexes))) {
		dataChange = SIGNIFICANT
	} else if (
		!_.isEqual(
			filterOut(oldRow, indexLng, indexLat, indexId, ...interestingFieldIndexes),
			filterOut(newRow, indexLng, indexLat, indexId, ...interestingFieldIndexes)
		)
	) {
		let nullIndexes = newRow.map((elem, i) => (elem == null || `${elem}`.length == 0 ? i : null)).filter(i => i != null)
		if (filterIn(oldRow, ...nullIndexes).filter(elem => elem != null).length > 0) {
			//something went from non-null to null, usually indicating an error
			dataChange = SIGNIFICANT
		} else {
			dataChange = INSIGNIFICANT
		}
	} else {
		dataChange = NONE
	}

	return {
		distance,
		locationChange,
		dataChange
	}
}

function printChanges(changes, indexLng, indexLat, indexId, interestingFieldIndexes) {
	let dataToLocation = Object.fromEntries(
		MUTATION_DESCRIPTORS.map(desc => [desc, Object.fromEntries(MUTATION_DESCRIPTORS.map(desc2 => [desc2, []]))])
	)
	changes.forEach(([oldRow, newRow]) => {
		let result = compareSimilarRow(oldRow, newRow, indexLng, indexLat, indexId, interestingFieldIndexes)
		dataToLocation[result.dataChange][result.locationChange].push({
			oldRow,
			newRow,
			distance: result.locationChange == NONE ? null : result.distance
		})
	})
	printMutationGroup(
		dataToLocation,
		SIGNIFICANT,
		SIGNIFICANT,
		'significant data changes + big distance changes',
		indexId
	)
	printMutationGroup(
		dataToLocation,
		SIGNIFICANT,
		INSIGNIFICANT,
		'significant data changes + small distance changes',
		indexId
	)
	printMutationGroup(dataToLocation, SIGNIFICANT, NONE, 'significant data changes', indexId)
	printMutationGroup(
		dataToLocation,
		INSIGNIFICANT,
		SIGNIFICANT,
		'insignificant data changes + big distance changes',
		indexId
	)
	printMutationGroup(
		dataToLocation,
		INSIGNIFICANT,
		INSIGNIFICANT,
		'insignificant data changes + small distance changes',
		indexId
	)
	printMutationGroup(dataToLocation, INSIGNIFICANT, NONE, 'insignificant data changes', indexId)
	printMutationGroup(dataToLocation, NONE, SIGNIFICANT, 'big distance changes', indexId)
	printMutationGroup(dataToLocation, NONE, INSIGNIFICANT, 'small distance changes', indexId)
	//no need to print none-none
}

function printMutationGroup(dataToLocation, dataMutation, locationMutation, descriptor, indexId) {
	let results = dataToLocation[dataMutation][locationMutation]
	if (results.length > 0) {
		console.log(`==========\n${descriptor}\n`)
		results.forEach(result => {
			if (result.distance != null) {
				console.log(`${result.newRow[indexId]} moved ${result.distance}m`)
			}
			console.log(JSON.stringify(result.oldRow))
			console.log(JSON.stringify(result.newRow))
		})
	}
}

async function compare(filePath, indexId) {
	let oldContents = await read(`tmp-input/old-data/${filePath}`, indexId)
	let newContents = await read(`../ui/src/js/bundles/${filePath}`, indexId)

	let {indexLng, indexLat, interestingFieldIndexes} = newContents

	if (!_.isEqual(oldContents.headers, newContents.headers)) {
		console.log('Headers differ:')
		console.log(oldContents.headers)
		console.log(newContents.headers)
	}
	if (oldContents.attribution !== newContents.attribution) {
		console.log('Attributions differ:')
		console.log(oldContents.attribution)
		console.log(newContents.attribution)
	}

	let oldData = oldContents.data
	let newData = newContents.data

	checkUniqueness(oldData, indexId)
	checkUniqueness(newData, indexId)

	let oldIndex = 0
	let newIndex = 0
	let oldMax = oldData.length
	let newMax = newData.length
	console.log(`Comparing ${oldMax} rows with ${newMax} rows`)

	let missing = [] //i.e. appear in old but not in new
	let added = [] //i.e. appear in new but not in old
	let changes = [] //i.e. id appears in both but other row values are different

	while (oldIndex < oldMax || newIndex < newMax) {
		if (oldIndex >= oldMax) {
			//new has extra rows at the end
			added.push(newData[newIndex])
			newIndex++
		} else if (newIndex >= newMax) {
			//old has extra rows at the end
			missing.push(oldData[oldIndex])
			oldIndex++
		} else {
			let oldRow = oldData[oldIndex]
			let newRow = newData[newIndex]
			if (oldRow[indexId] == newRow[indexId]) {
				//same row id
				if (!_.isEqual(oldRow, newRow)) {
					changes.push([oldRow, newRow])
				}
				newIndex++
				oldIndex++
			} else {
				//different rows
				if (String(oldRow[indexId]).localeCompare(String(newRow[indexId])) < 0) {
					//old has been removed
					missing.push(oldData[oldIndex])
					oldIndex++
				} else {
					//new must be an insertion
					added.push(newData[newIndex])
					newIndex++
				}
			}
		}
	}

	if (missing.length > 0 || added.length > 0 || changes.length > 0) {
		if (missing.length > 0 && added.length > 0) {
			if (missing.length * added.length > 10000) {
				console.error('Too many additions/deletions to try to work out matches')
			} else {
				let result = reconcileDrops(missing, added, indexLng, indexLat, indexId)
				missing = result.missing
				added = result.added
				changes = changes.concat(result.changes)
			}
		}

		if (missing.length) {
			console.log('\n')
			console.log(`Missing from new (${missing.length}):`)
			missing.forEach(row => {
				console.log(JSON.stringify(row))
			})
		} else {
			console.log(`No entries missing`)
		}

		if (added.length) {
			console.log('\n')
			console.log(`Added in new (${added.length}):`)
			added.forEach(row => {
				console.log(JSON.stringify(row))
			})
		} else {
			console.log(`No entries added`)
		}

		if (changes.length) {
			console.log('\n')
			console.log(`Changed (${changes.length}):`)
			printChanges(changes, indexLng, indexLat, indexId, interestingFieldIndexes)
		} else {
			console.log(`No entries changed`)
		}
	} else {
		console.log('Contents are the same')
	}
}

function reconcileDrops(missing, added, indexLng, indexLat, indexId) {
	const extract = row => {
		return {latitude: row[indexLat], longitude: row[indexLng]}
	}

	let matches = [] //uses id of 'missing'
	missing.forEach((missingRow, missingIndex) => {
		added.forEach((addedRow, addedIndex) => {
			let distance = geolib.getDistance(extract(missingRow), extract(addedRow))
			if (distance < 10) {
				if (matches[missingIndex] === undefined) {
					matches[missingIndex] = []
				}
				matches[missingIndex].push({distance, addedIndex})
			}
		})
	})
	let takenAddedIndexes = []
	matches = matches.map(rowMatches => {
		if (rowMatches !== undefined) {
			let sorted = rowMatches.sort((a, b) => a.distance - b.distance)
			return sorted.find(match => {
				if (!takenAddedIndexes.includes(match.addedIndex)) {
					takenAddedIndexes.push(match.addedIndex)
					return true
				}
			})
		}
	})

	let changes = []
	if (matches.length > 0) {
		console.log('Making the following assumptions about re-names:')
		matches.forEach((match, i) => {
			changes.push([missing[i], added[match.addedIndex]])
			console.log(missing[i][indexId], ' -> ', added[match.addedIndex][indexId])
			missing[i] = null
			added[match.addedIndex] = null
		})
	}
	missing = missing.filter(elem => elem != null)
	added = added.filter(elem => elem != null)

	return {
		changes,
		added,
		missing
	}
}

// compare('coastallandmarks/data.json', 2)
// compare('defence/data.json', 2)
// compare('follies/data.json', 2)
// compare('hills/data_all.json', 2)
// compare('nt/data.json', 2)
// compare('rnli/data.json', 2)
compare('trigs/data_all.json', 2)
