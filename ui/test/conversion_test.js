import {assert} from 'chai'

import conversion from '@tstibbs/geo-bagging-shared/conversion.js'

describe('conversion', function () {
	it('latLngToGridRef - should return actual grid refs', function () {
		assert.equal(conversion.latLngToGridRef(52.657977, 1.716038), 'TG 51408 13177')
	})

	it('osgbToLngLat - should work for valid OSBGs', function () {
		var actualValue = conversion.osgbToLngLat(651409, 313177) // array is long, lat
		assert.equal(actualValue.length, 2)
		assertNear(assert, actualValue[0], 1.7160384428258, 0)
		assertNear(assert, actualValue[1], 52.657976601295, 0)
	})

	it('gridRefToOsgb - should work for valid grid refs', function () {
		assert.deepEqual(conversion.gridRefToOsgb('TG 51408 13177'), [651408, 313177]) // array is long, lat
	})
	it('gridRefToOsgb - should work for channel islands', function () {
		assert.deepEqual(conversion.gridRefToOsgb('XD  83873  22339'), [383873, -77661]) // array is long, lat
	})

	it('gridRefToLngLat - should work for valid grid refs', function () {
		assertCloseEnough(assert, 'TG 51408 13177', 1.716023690108, 52.657977064472, 0)
	})

	it('gridRefToOsgb - should error for irish grids', function () {
		assert.throws(function () {
			conversion.gridRefToOsgb('S  6797  3789')
		}, /Irish/)
		assert.throws(function () {
			conversion.gridRefToOsgb('W328850')
		}, /Irish/)
	})

	it('gridRefToLngLat - should work for ireland', function () {
		assertCloseEnough(assert, 'MZ 82568 85820', -8.53034, 54.99125, 0.00002)
		assertCloseEnough(assert, 'MZ 86383 16308', -8.37269, 54.37367, 0.00002)
		assertCloseEnough(assert, 'RE 09504 80322', -9.48801, 53.98501, 0.00002)
		assertCloseEnough(assert, 'RO 61800 27500', -9.79229, 51.68706, 0.00002)
	})

	it('gridRefToLngLat - should work for channel islands', function () {
		/* channel islands grid doesn't use OSGB but confusingly looks the same. Whilst these grid refs
		 * are kind of valid in OSGB (though outside of the 'normal' grid), we assume that they're channel
		 * islands grid references, as that's the most likely case. */
		assertCloseEnough(assert, 'WA 55943 05921', -2.22416, 49.7032, 0.0001)
		assertCloseEnough(assert, 'WA 57817 06737', -2.19805, 49.71036, 0.0001)
		assertCloseEnough(assert, 'WV 35753 83894', -2.50615, 49.50662, 0.0001)
	})
})

function assertCloseEnough(assert, gridRef, lon, lat, leeway) {
	var actualValue = conversion.gridRefToLngLat(gridRef) // array is long, lat
	assert.equal(actualValue.length, 2)
	assertNear(assert, actualValue[0], lon, leeway)
	assertNear(assert, actualValue[1], lat, leeway)
}

// The exact results seem to change slightly from browser to browser, and even between different versions of node.
// However, the 5th decimal place is about 1 metre at our latitude/longitude, so we _really_ don't need to care about small differences
function assertNear(assert, actual, expected, leeway) {
	var rounder = 100000
	var lower = Math.floor(expected * rounder) / rounder
	var upper = Math.ceil(expected * rounder) / rounder
	lower -= leeway
	upper += leeway

	assert.ok(actual >= lower, actual + ' should be >= ' + lower)
	assert.ok(actual <= upper, actual + ' should be <= ' + upper)
}
