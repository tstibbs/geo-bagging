import _ from 'underscore'
import geolib from 'geolib'
import {ifCmd} from '@tstibbs/cloud-core-utils'

import {readFile, writeFile, createTempDir} from './utils.js'

const HEADER_LNG = 'Longitude'
const HEADER_LAT = 'Latitude'
const INTERESTING_FIELDS = ['Name', 'Link', 'Url']

const NONE = Symbol('NONE')
const SIGNIFICANT = Symbol('SIGNIFICANT')
const INSIGNIFICANT = Symbol('INSIGNIFICANT')
const MUTATION_DESCRIPTORS = [NONE, SIGNIFICANT, INSIGNIFICANT]

class CsvComparer {
	constructor(source, file) {
		this._filePath = `${source}/${file}`
		this._source = source
		this._file = file
		this._indexId = 2
		this._report = ''
	}

	_print(line) {
		this._report += line
		this._report += '\n'
	}

	async _printReport() {
		let dir = `tmp-input/comparisons/${this._source}`
		await createTempDir(dir)
		let reportPath = `${dir}/${this._file}.report.txt`
		await writeFile(reportPath, this._report)
		return reportPath
	}

	async _read(path) {
		let raw = await readFile(path)
		let contents = JSON.parse(raw)
		let headers = contents.headers.replace('[', '').replace(']', '').split(',')
		let indexLng = headers.indexOf(HEADER_LNG)
		let indexLat = headers.indexOf(HEADER_LAT)
		let interestingFieldIndexes = INTERESTING_FIELDS.map(field => headers.indexOf(field)).filter(
			index => index != null && index != -1 && index != this._indexId
		)
		let attribution = contents.attribution
		let data = contents.data.sort((a, b) => String(a[this._indexId]).localeCompare(String(b[this._indexId])))
		return {
			data,
			indexLng,
			indexLat,
			headers,
			attribution,
			interestingFieldIndexes
		}
	}

	_checkUniqueness(data) {
		let all = data.map(row => row[this._indexId])
		let uniques = _.uniq(all)
		if (all.length !== uniques.length) {
			this._print(`Keys not unique: ${all.length - uniques.length} are duplicates`)
		}
	}

	_filterOut(row, ...indexes) {
		return row.filter((elem, i) => !indexes.includes(i))
	}

	_filterIn(row, ...indexes) {
		return row.filter((elem, i) => indexes.includes(i))
	}

	_compareSimilarRow(oldRow, newRow, interestingFieldIndexes) {
		let oldLng = oldRow[this._indexLng]
		let oldLat = oldRow[this._indexLat]
		let newLng = newRow[this._indexLng]
		let newLat = newRow[this._indexLat]

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
		if (
			!_.isEqual(this._filterIn(oldRow, ...interestingFieldIndexes), this._filterIn(newRow, ...interestingFieldIndexes))
		) {
			dataChange = SIGNIFICANT
		} else if (
			!_.isEqual(
				this._filterOut(oldRow, ...interestingFieldIndexes, this._indexLng, this._indexLat),
				this._filterOut(newRow, ...interestingFieldIndexes, this._indexLng, this._indexLat)
			)
		) {
			let nullIndexes = newRow
				.map((elem, i) => (elem == null || `${elem}`.length == 0 ? i : null))
				.filter(i => i != null)
			if (this._filterIn(oldRow, ...nullIndexes).filter(elem => elem != null).length > 0) {
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

	_printChanges(changes, interestingFieldIndexes) {
		let dataToLocation = Object.fromEntries(
			MUTATION_DESCRIPTORS.map(desc => [desc, Object.fromEntries(MUTATION_DESCRIPTORS.map(desc2 => [desc2, []]))])
		)
		changes.forEach(([oldRow, newRow]) => {
			let result = this._compareSimilarRow(oldRow, newRow, interestingFieldIndexes)
			dataToLocation[result.dataChange][result.locationChange].push({
				oldRow,
				newRow,
				distance: result.locationChange == NONE ? null : result.distance
			})
		})
		let notableChanges = this._printMutationGroup(
			dataToLocation,
			SIGNIFICANT,
			SIGNIFICANT,
			'significant data changes + big distance changes'
		)
		notableChanges |= this._printMutationGroup(
			dataToLocation,
			SIGNIFICANT,
			INSIGNIFICANT,
			'significant data changes + small distance changes'
		)
		notableChanges |= this._printMutationGroup(dataToLocation, SIGNIFICANT, NONE, 'significant data changes')
		notableChanges |= this._printMutationGroup(
			dataToLocation,
			INSIGNIFICANT,
			SIGNIFICANT,
			'insignificant data changes + big distance changes'
		)
		this._printMutationGroup(
			dataToLocation,
			INSIGNIFICANT,
			INSIGNIFICANT,
			'insignificant data changes + small distance changes'
		)
		this._printMutationGroup(dataToLocation, INSIGNIFICANT, NONE, 'insignificant data changes')
		notableChanges |= this._printMutationGroup(dataToLocation, NONE, SIGNIFICANT, 'big distance changes')
		this._printMutationGroup(dataToLocation, NONE, INSIGNIFICANT, 'small distance changes')
		//no need to _print none-none
		return notableChanges
	}

	_printMutationGroup(dataToLocation, dataMutation, locationMutation, descriptor) {
		let results = dataToLocation[dataMutation][locationMutation]
		if (results.length > 0) {
			this._print(`==========\n${descriptor}\n`)
			results.forEach(result => {
				if (result.distance != null) {
					this._print(`${result.newRow[this._indexId]} moved ${result.distance}m`)
				}
				this._print(JSON.stringify(result.oldRow))
				this._print(JSON.stringify(result.newRow))
			})
			return true
		} else {
			return false
		}
	}

	async compare() {
		let oldContents = await this._read(`tmp-input/old-data/${this._filePath}`)
		let newContents = await this._read(`../ui/src/js/bundles/${this._filePath}`)

		let {interestingFieldIndexes} = newContents
		this._indexLng = newContents.indexLng
		this._indexLat = newContents.indexLat

		let metaDifferences = false
		if (!_.isEqual(oldContents.headers, newContents.headers)) {
			metaDifferences = true
			this._print('Headers differ:')
			this._print(oldContents.headers)
			this._print(newContents.headers)
		}
		if (oldContents.attribution !== newContents.attribution) {
			metaDifferences = true
			this._print('Attributions differ:')
			this._print(oldContents.attribution)
			this._print(newContents.attribution)
		}

		let oldData = oldContents.data
		let newData = newContents.data

		this._checkUniqueness(oldData)
		this._checkUniqueness(newData)

		let oldIndex = 0
		let newIndex = 0
		let oldMax = oldData.length
		let newMax = newData.length
		this._print(`Comparing ${oldMax} rows with ${newMax} rows`)

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
				if (oldRow[this._indexId] == newRow[this._indexId]) {
					//same row id
					if (!_.isEqual(oldRow, newRow)) {
						changes.push([oldRow, newRow])
					}
					newIndex++
					oldIndex++
				} else {
					//different rows
					if (String(oldRow[this._indexId]).localeCompare(String(newRow[this._indexId])) < 0) {
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

		let notableChanges = false
		let totalChanges = missing.length + added.length + changes.length
		if (totalChanges > 0) {
			if (missing.length > 0 && added.length > 0) {
				if (missing.length * added.length > 10000) {
					this._print('Too many additions/deletions to try to work out matches')
				} else {
					let result = this._reconcileDrops(missing, added)
					missing = result.missing
					added = result.added
					changes = changes.concat(result.changes)
				}
				notableChanges = true
			}

			if (missing.length) {
				this._print('\n')
				this._print(`Missing from new (${missing.length}):`)
				missing.forEach(row => {
					this._print(JSON.stringify(row))
				})
				notableChanges = true
			} else {
				this._print(`No entries missing`)
			}

			if (added.length) {
				this._print('\n')
				this._print(`Added in new (${added.length}):`)
				added.forEach(row => {
					this._print(JSON.stringify(row))
				})
				notableChanges = true
			} else {
				this._print(`No entries added`)
			}

			if (changes.length) {
				this._print('\n')
				this._print(`Changed (${changes.length}):`)
				notableChanges |= this._printChanges(changes, interestingFieldIndexes)
			} else {
				this._print(`No entries changed`)
			}
		}
		if (notableChanges || metaDifferences) {
			let reportPath = await this._printReport()
			let info1 = `${totalChanges} changes`
			let info2 = `meta changes`
			let info = ''
			if (totalChanges > 0 && metaDifferences) {
				info = `${info1} + ${info2}`
			} else if (totalChanges > 0) {
				info = info1
			} else if (metaDifferences) {
				info = info2
			} else {
				throw new Exception('Unexpected')
			}
			return `${info} - please review ${reportPath}`
		} else {
			let infoText = 'No notable changes or meta differences'
			console.log(infoText)
			await this._printReport() //just to ensure the report is overwritten if we have made a 'fix' and then re-ran this tool
			return null
		}
	}

	_reconcileDrops(missing, added) {
		const extract = row => {
			return {latitude: row[this._indexLat], longitude: row[this._indexLng]}
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
			this._print('Making the following assumptions about re-names:')
			matches.forEach((match, i) => {
				changes.push([missing[i], added[match.addedIndex]])
				this._print(missing[i][this._indexId], ' -> ', added[match.addedIndex][this._indexId])
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
}

async function compare(source, file) {
	return await new CsvComparer(source, file).compare()
}

async function cli() {
	const args = process.argv.slice(2)
	await compare(args[0], args[1])
}

await ifCmd(import.meta, cli)

export default compare
