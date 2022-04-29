import $ from 'jquery'
import configBase from './config.js'

export default function build(config) {
	return $.extend({}, configBase(config), {
		dataToLoad: 'data_all.json',
		aspectLabel: 'Hills (all)'
	})
}
