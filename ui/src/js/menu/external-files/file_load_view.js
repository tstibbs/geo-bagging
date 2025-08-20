import leaflet from 'VendorWrappers/leaflet.js'
import $ from 'jquery'

var FileLoadView = leaflet.Class.extend({
	initialize: function (loadLabel, loadExtensions) {
		this._view = $('<div class="setting"></div>')
		this._view.append($(`<span>${loadLabel}: </span></br>`))
		this._fileInput = $(`<input type="file" accept="${loadExtensions}" multiple>`)
		this._view.append(this._fileInput)
		this._fileInput.on('change', async () => {
			//this is called from the browser, so async errors will cause an uncaught promise rejection
			try {
				await this._readFiles()
			} catch (e) {
				console.error('failed to read files')
				console.error(e)
			}
		})
		this._fileCounter = 0
	},

	_readFiles: async function () {
		var datas = []
		var files = this._fileInput[0].files
		for (var i = 0; i < files.length; i++) {
			const file = files.item(i)
			var parsed = await this._parseFileContents(file)
			datas.push({
				name: `${this._fileCounter} - ${file.name}`, //counter just to make the name unique
				...parsed
			})
			this._fileCounter++
			if (datas.length == files.length) {
				this._finishedReadingFiles(datas)
			}
		}
	},

	_finishedReadingFiles: function (datas) {
		throw new Error('Not implemented')
	},

	_parseFileContents: async function (file) {
		throw new Error('Not implemented')
	},

	getView: function () {
		return this._view
	}
})

export default FileLoadView
