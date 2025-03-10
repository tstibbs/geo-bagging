import FilesView from './files_view.js'
import FileLoadView from './file_load_view.js'

var FileFeaturesLoadView = FileLoadView.extend({
	initialize: function (manager, bundle) {
		FileLoadView.prototype.initialize.call(this, bundle)
		this._filesView = new FilesView(
			manager,
			this._bundle.aspectLabel,
			this._bundle.colour,
			this._bundle.initialOutlineWidth
		)
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
	}
})

export default FileFeaturesLoadView
