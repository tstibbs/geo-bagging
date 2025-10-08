import {jest} from '@jest/globals'

const mock = {
	location: {search: ''}
}
async function runTest(getParams, callback) {
	mock.location.search = '?' + getParams
	let params = await import('../src/js/params.js')
	callback(new params.default.tester())
}

describe('params', () => {
	beforeAll(() => {
		jest.unstable_mockModule('../src/js/global.js', () => ({default: mock}))
	})

	it('single param', async () => {
		await runTest('blah=stuff', params => {
			expect(params.test('blah')).toBe('stuff')
		})
	})

	it('many params', async () => {
		await runTest('blah=stuff&more=xyz', params => {
			expect(params.test('blah')).toBe('stuff')
			expect(params.test('more')).toBe('xyz')
			expect(params.test('xyz')).toBeUndefined()
		})
	})

	it('multi-value params', async () => {
		await runTest('blah=stuff,thing&more=xyz&more=abc', params => {
			expect(params.test('blah')).toBe('stuff,thing')
			expect(params.test('more')).toBe('abc') //if the param appears multiple times, we just use the last one - this is a known limitation
		})
	})
})
