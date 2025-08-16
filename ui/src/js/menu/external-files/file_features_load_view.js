import FilesView from './files_view.js'
import FileLoadView from './file_load_view.js'

var FileFeaturesLoadView = FileLoadView.extend({
	initialize: function (manager, bundle) {
		FileLoadView.prototype.initialize.call(this, bundle.loadLabel, bundle.loadExtensions)
		this._bundle = bundle
		this._filesView = new FilesView(manager, this._bundle.aspectLabel, this._bundle.style)
	},

	_finishedReadingFiles: function (datas) {
		//datas is [{name, bounds, features}]
		this._filesView.showNewLayers(datas)
	},

	_parseFileContents: async function (file) {
		const {features, bounds} = this._bundle.fileContentsParser(await file.text())
		return {
			features,
			bounds
		}
	}
})

export default FileFeaturesLoadView
