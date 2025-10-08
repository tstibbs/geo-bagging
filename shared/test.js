import conversion from './conversion.js'

describe('conversion', () => {
	test('latLngToGridRef - should return actual grid refs', () => {
		expect(conversion.latLngToGridRef(52.657977, 1.716038)).toBe('TG 51408 13177')
	})

	test('osgbToLngLat - should work for valid OSBGs', () => {
		const actualValue = conversion.osgbToLngLat(651409, 313177)
		expect(actualValue.length).toBe(2)
		assertNear(actualValue[0], 1.7160384428258, 0)
		assertNear(actualValue[1], 52.657976601295, 0)
	})

	test('gridRefToOsgb - should work for valid grid refs', () => {
		expect(conversion.gridRefToOsgb('TG 51408 13177')).toEqual([651408, 313177])
	})

	test('gridRefToOsgb - should work for channel islands', () => {
		expect(conversion.gridRefToOsgb('XD  83873  22339')).toEqual([383873, -77661])
	})

	test('gridRefToLngLat - should work for valid grid refs', () => {
		assertCloseEnough('TG 51408 13177', 1.716023690108, 52.657977064472, 0)
	})

	test('gridRefToOsgb - should error for irish grids', () => {
		expect(() => conversion.gridRefToOsgb('S  6797  3789')).toThrow(/Irish/)
		expect(() => conversion.gridRefToOsgb('W328850')).toThrow(/Irish/)
	})

	test('gridRefToLngLat - should work for ireland', () => {
		assertCloseEnough('MZ 82568 85820', -8.53034, 54.99125, 0.00002)
		assertCloseEnough('MZ 86383 16308', -8.37269, 54.37367, 0.00002)
		assertCloseEnough('RE 09504 80322', -9.48801, 53.98501, 0.00002)
		assertCloseEnough('RO 61800 27500', -9.79229, 51.68706, 0.00002)
	})

	test('gridRefToLngLat - should work for channel islands', () => {
		assertCloseEnough('WA 55943 05921', -2.22416, 49.7032, 0.0001)
		assertCloseEnough('WA 57817 06737', -2.19805, 49.71036, 0.0001)
		assertCloseEnough('WV 35753 83894', -2.50615, 49.50662, 0.0001)
	})
})

function assertCloseEnough(gridRef, lon, lat, leeway) {
	const actualValue = conversion.gridRefToLngLat(gridRef)
	expect(actualValue.length).toBe(2)
	assertNear(actualValue[0], lon, leeway)
	assertNear(actualValue[1], lat, leeway)
}

function assertNear(actual, expected, leeway) {
	const rounder = 100000
	let lower = Math.floor(expected * rounder) / rounder
	let upper = Math.ceil(expected * rounder) / rounder
	lower -= leeway
	upper += leeway

	expect(actual).toBeGreaterThanOrEqual(lower)
	expect(actual).toBeLessThanOrEqual(upper)
}
