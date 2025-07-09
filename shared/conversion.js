//heavily borrowed from www.movable-type.co.uk/scripts/latlong-gridref.html (MIT licence)
import proj4 from 'proj4'

var osgbProj = proj4(
	'+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs'
)

function pad(num, w) {
	var n = num.toString()
	while (n.length < w) n = '0' + n
	return n
}

export default {
	latLngToGridRef: function (lat, lng) {
		var digits = 10

		var out = osgbProj.forward([lng, lat]) //from WSG84
		var eastings = out[0]
		var northings = out[1]

		digits = digits === undefined ? 10 : Number(digits)
		if (isNaN(digits)) throw new Error('Invalid precision')

		var e = Number(Number(eastings))
		var n = Number(Number(northings))

		if (isNaN(e) || isNaN(n)) throw new Error('Invalid grid reference: ' + [lat, lng])

		// use digits = 0 to return numeric format (in metres)
		if (digits === 0) return pad(e, 6) + ',' + pad(n, 6)

		// get the 100km-grid indices
		var e100k = Math.floor(e / 100000),
			n100k = Math.floor(n / 100000)

		if (e100k < 0 || e100k > 6 || n100k < 0 || n100k > 12) return ''

		// translate those into numeric equivalents of the grid letters
		var l1 = 19 - n100k - ((19 - n100k) % 5) + Math.floor((e100k + 10) / 5)
		var l2 = (((19 - n100k) * 5) % 25) + (e100k % 5)

		// compensate for skipped 'I' and build grid letter-pairs
		if (l1 > 7) l1++
		if (l2 > 7) l2++
		var letPair = String.fromCharCode(l1 + 'A'.charCodeAt(0), l2 + 'A'.charCodeAt(0))

		// strip 100km-grid indices from easting & northing, and reduce precision
		e = Math.floor((e % 100000) / Math.pow(10, 5 - digits / 2))
		n = Math.floor((n % 100000) / Math.pow(10, 5 - digits / 2))

		var gridRef = letPair + ' ' + pad(e, digits / 2) + ' ' + pad(n, digits / 2)

		return gridRef
	},

	osgbToLngLat: function (eastings, northings) {
		var out = osgbProj.inverse([eastings, northings]) //to WSG84
		return out
	},

	gridRefToOsgb: function (/*String*/ gridref) {
		gridref = String(gridref).trim()
		this._determineGridRefType(gridref)

		// check for fully numeric comma-separated gridref format
		var match = gridref.match(/^(\d+),\s*(\d+)$/)
		if (match) return new OsGridRef(match[1], match[2])

		// validate format
		match = gridref.match(/^[A-Z]{2}\s*[0-9]+\s*[0-9]+$/i)
		if (!match) throw new Error('Invalid grid reference: ' + gridref)

		// get numeric values of letter references, mapping A->0, B->1, C->2, etc:
		var l1 = gridref.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)
		var l2 = gridref.toUpperCase().charCodeAt(1) - 'A'.charCodeAt(0)
		// shuffle down letters after 'I' since 'I' is not used in grid:
		if (l1 > 7) l1--
		if (l2 > 7) l2--

		// convert grid letters into 100km-square indexes from false origin (grid square SV):
		var e100km = ((l1 - 2) % 5) * 5 + (l2 % 5)
		var n100km = 19 - Math.floor(l1 / 5) * 5 - Math.floor(l2 / 5)

		// skip grid letters to get numeric (easting/northing) part of ref
		var en = gridref.slice(2).trim().split(/\s+/)
		// if e/n not whitespace separated, split half way
		if (en.length == 1) en = [en[0].slice(0, en[0].length / 2), en[0].slice(en[0].length / 2)]

		//fix for grid refs technically part of the grid but outside of the uk
		//this helped to work this out: https://raw.githubusercontent.com/wu-lee/dinty/master/national-grid.png
		if (e100km >= 15) {
			e100km -= 25
		}
		if (n100km > 20) {
			n100km -= 25
		}

		// validation
		if (e100km < -10 || n100km < -5)
			throw new Error('Invalid grid reference: gridref=' + gridref + ', e100km=' + e100km + ', n100km=' + n100km)
		if (en.length != 2) throw new Error('Invalid grid reference: ' + gridref)
		if (en[0].length != en[1].length) throw new Error('Invalid grid reference: ' + gridref)

		// standardise to 10-digit refs (metres)
		en[0] = (en[0] + '00000').slice(0, 5)
		en[1] = (en[1] + '00000').slice(0, 5)

		var e = parseInt(e100km + '00000') + parseInt(en[0])
		var n = parseInt(n100km + '00000') + parseInt(en[1])

		return [e, n]
	},

	gridRefToLngLat: function (/*String*/ gridref) {
		var lngLat = this.gridRefToOsgb(gridref)
		var out = osgbProj.inverse(lngLat) //to WSG84
		return out
	},

	_determineGridRefType: function (gridref) {
		if (/^\w\s*\d{3,}\s*\d{3,}$/.test(gridref)) {
			throw new Error('Irish grid references currently unsupported: ' + gridref)
		}
	}
}
