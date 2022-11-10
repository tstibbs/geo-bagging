import leaflet from 'VendorWrappers/leaflet.js'
import $ from 'jquery'
import FilesView from '../external-files/files_view.js'

var FileLoadView = leaflet.Class.extend({
	initialize: function (manager, bundle) {
		this._bundle = bundle
		this._view = $('<div class="setting"></div>')
		this._view.append($(`<span>${this._bundle.loadLabel}: </span></br>`))
		this._fileInput = $(`<input type="file" accept="${this._bundle.loadExtensions}" multiple>`)
		this._view.append(this._fileInput)
		this._fileInput.on('change', this._readFiles.bind(this))
		this._fileCounter = 0
		this._filesView = new FilesView(
			manager,
			this._bundle.aspectLabel,
			this._bundle.colour,
			this._bundle.initialOutlineWidth
		)
	},

	_readFiles: function () {
		var datas = []
		var files = this._fileInput[0].files
		for (var i = 0; i < files.length; i++) {
			;(function (file) {
				//just scoping
				var reader = new FileReader()
				//note this function is called asynchronously
				reader.onload = function (e) {
					var parsed = this._parseFileContents(reader.result)
					datas.push({
						name: `${this._fileCounter} - ${file.name}`, //counter just to make the name unique
						...parsed
					})
					this._fileCounter++
					if (datas.length == files.length) {
						this._finishedReadingFiles(datas)
					}
				}.bind(this)
				reader.readAsText(file)
			}.bind(this)(files.item(i)))
		}
	},

	_finishedReadingFiles: function (datas) {
		//datas is [{name, bounds, features}]
		this._filesView.showNewLayers(datas)
	},

	_parseFileContents: function (fileContents) {
		const {features, bounds} = this._bundle.fileContentsParser(fileContents)
		return {
			features,
			bounds
		}
	},

	getView: function () {
		return this._view
	}
})

export default FileLoadView
