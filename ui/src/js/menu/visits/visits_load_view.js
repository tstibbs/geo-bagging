import FileLoadView from '../external-files/file_load_view.js'
import {fileToSources} from '../../constraints/visits-excel-parser.js'

export const VisitsLoadView = FileLoadView.extend({
	initialize: function (manager, visitsMenuView) {
		FileLoadView.prototype.initialize.call(this, "Upload file listing 'visited' POIs", '.xlsx')
		this._manager = manager
		this._visitsMenuView = visitsMenuView
	},

	_finishedReadingFiles: function (datas) {
		const visits = datas.map(data => data.visits)
		const mergedData = {}
		const keys = new Set(visits.map(Object.keys).flat())
		for (const key of keys) {
			mergedData[key] = visits
				.filter(data => key in data)
				.map(data => data[key])
				.flat()
		}
		this._visitsMenuView.setVisits(this, mergedData)
	},

	_parseFileContents: async function (file) {
		let sources = await fileToSources(file)
		return {
			visits: sources
		}
	},

	reset: function () {
		this._fileInput.val('')
	}
})
