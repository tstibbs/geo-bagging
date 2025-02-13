import _ from 'underscore'

const maxDisplayTextLength = 100
const maxDisplayArrayLength = 10

export default {
	notEmpty: function (input) {
		return input !== undefined && input !== null && input.length > 0
	},

	_truncateDisplayString: function (value) {
		//truncate values if they are long, to prevent popup boxes getting too large
		if (value.length > maxDisplayTextLength) {
			return value.substring(0, maxDisplayTextLength - 3) + '...'
		} else {
			return value
		}
	},

	_truncateDisplayArray: function (value) {
		//truncate values if they are long, to prevent popup boxes getting too large
		if (value.length > maxDisplayArrayLength) {
			return [...value.slice(0, maxDisplayArrayLength), '...']
		} else {
			return value
		}
	},

	_buildValue: function (value) {
		if (typeof value === 'object' && 'url' in value) {
			let {url, text, type} = value
			url = this._escapeValue(url)
			text = this._truncateDisplayString(this._escapeValue(text))
			if (type != null && type.startsWith('image/')) {
				return `
				<div class="popup-image-width-preserver"></div>
				<a href="${url}">
					<img class="popup-image" src="${url}" title="${text}">
				</a>`
			} else {
				return `<a href="${url}">${text}</a>`
			}
		} else if (Array.isArray(value) && value.length == 2) {
			//legacy array-based method
			let text = this._truncateDisplayString(this._escapeValue(value[0]))
			let url = this._escapeValue(value[1])
			return `<a href="${url}">${text}</a>`
		} else {
			return this._truncateDisplayString(this._escapeValue(value))
		}
	},

	_escapeValue: function (value) {
		if (Array.isArray(value)) {
			return value.map(this._escapeValue.bind(this))
		} else {
			if (value == null) {
				return value
			}
			if (typeof value !== 'string') {
				value = JSON.stringify(value) //prevents '[Object object]' showing up on the ui if this turns out to be an object because of some bad data
			}
			return _.escape(value)
		}
	},

	buildShortDescription: function (extraTexts) {
		return Object.keys(extraTexts)
			.map(function (key) {
				return extraTexts[key]
			})
			.filter(function (value) {
				return value != null && value != ''
			})
			.map(function (value) {
				function extractValue(val) {
					if (Array.isArray(val) && val.length == 2) {
						return val[0]
					} else {
						return val
					}
				}
				if (Array.isArray(value)) {
					return value.map(extractValue).join('/')
				} else {
					return extractValue(value)
				}
			})
			.join(', ')
	},

	buildDescription: function (extraTexts) {
		var popupText = ''
		extraTexts.forEach(
			function (keyAndVal) {
				var key = keyAndVal[0]
				var value = keyAndVal[1]
				if (value != null && value != '') {
					if (popupText.length > 0) {
						popupText += '<br />'
					}
					popupText += '<span class="popup-entry-key">' + _.escape(key) + ': </span>'
					if (Array.isArray(value)) {
						if (value.length > 1) {
							value = this._truncateDisplayArray(value)
							popupText += '<ul class="popup-entry-list">'
							for (var i = 0; i < value.length; i++) {
								popupText += '<li>' + this._buildValue(value[i]) + '</li>'
							}
							popupText += '</ul>'
						} else {
							popupText += '<span>' + this._buildValue(value[0]) + '</span>'
						}
					} else {
						popupText += '<span>' + this._buildValue(value) + '</span>'
					}
				}
			}.bind(this)
		)
		return popupText
	},

	buildPopup: function (manager, unescapedName, unescapedUrl, latLng, unescapedExtraTexts, visited) {
		//get everything from the model - anything that gets put into the dom needs to be escaped to prevent XSS
		var name = _.escape(unescapedName)
		var url = _.escape(unescapedUrl)

		var popupText = '<div>'
		if (this.notEmpty(url)) {
			popupText = '<a href="' + url + '" class="popup-title">' + name + '</a>'
		} else if (this.notEmpty(name)) {
			popupText = '<span class="popup-title">' + name + '</span>'
		}
		if (manager.shouldManageVisits() && visited != null) {
			popupText += '<label class="fancy-checkbox" title="Visited?">'
			popupText += '    <input type="checkbox"' + (visited ? ' checked' : '') + '/>'
			popupText += '    <i class="fa fa-check"></i>'
			popupText += '</label>'
		}
		if (unescapedExtraTexts != null) {
			if (popupText.length > 0) {
				popupText += '<br />'
			}
			popupText += this.buildDescription(unescapedExtraTexts)
		}

		if (latLng != null) {
			var lat = latLng[0]
			var lng = latLng[1]
			var googleUrl = 'https://www.google.com/maps/place/' + lat + '+' + lng + '/@' + lat + ',' + lng + ',15z'
			var bingUrl =
				'https://www.bing.com/maps/?mkt=en-gb&v=2&cp=' +
				lat +
				'~' +
				lng +
				'&lvl=14&sp=Point.' +
				lat +
				'_' +
				lng +
				'_' +
				name
			var geohackUrl =
				'https://tools.wmflabs.org/geohack/geohack.php?pagename=' +
				name +
				'&params=' +
				lat +
				'_N_' +
				lng +
				'_E_region%3AGB_'

			popupText += '<div class="expandable expandable-links">'
			popupText += '<input type="checkbox" value="selected" id="links-checkbox" class="expandable-checkbox">'
			popupText +=
				'<label for="links-checkbox" class="expandable-checkbox-label"><i class="fa fa-external-link" aria-hidden="true"></i></label>'
			popupText += '<div class="expandable-content links">'
			popupText += '<a href="' + googleUrl + '">View on google maps</a>'
			popupText += '<br /><a href="' + bingUrl + '">View on bing maps</a>'
			popupText += '<br /><a href="' + geohackUrl + '">View on geohack</a>'
			popupText += '</div>'
			popupText += '</div>'
		}

		popupText += '</div>'
		return popupText
	}
}
