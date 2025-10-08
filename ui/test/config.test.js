import Config from '../src/js/config.js'

describe('config', () => {
	beforeEach(() => {
		if (typeof localStorage !== 'undefined') {
			localStorage.clear()
		}
	})
	test('should inherit defaults', () => {
		const config = new Config()
		expect(config.cluster).toBe(true)
		expect(config.dimensional_layering).toBe(false)
		expect(config.blah).toBeUndefined()
		expect(config.hasOwnProperty('blah')).toBe(false)
	})
	test('defaults can be overridden', () => {
		const config = new Config({
			cluster: false,
			blah: 'stuff'
		})
		expect(config.cluster).toBe(false)
		expect(config.dimensional_layering).toBe(false)
		expect(config.blah).toBe('stuff')
		expect(config.hasOwnProperty('blah')).toBe(true)
	})
	describe('persistence', () => {
		test('can save and retrieve', () => {
			const config = new Config({
				blah: 4
			})
			expect(config.blah).toBe(4)
			config.persist({
				blah: 5
			})
			expect(config.blah).toBe(4) //should still be 4 - persisting shouldn't change the retrieved values until we reload the page
			const config2 = new Config({
				blah: 4
			})
			expect(config2.blah).toBe(5) //saved value should override the value from config
		})
		test('can save and retrieve with null options', () => {
			const config = new Config()
			config.persist({
				blah: 5
			})
			const config2 = new Config()
			expect(config2.blah).toBe(5) //saved value should now be available
		})
		test('can force override', () => {
			const config = new Config()
			config.persist({
				blah: 5
			})
			const config2 = new Config({
				force_config_override: true,
				blah: 4
			})
			expect(config2.blah).toBe(4) //passed-in value should override saved value
		})
		test('saving is for a given page id', () => {
			//set up
			const config1 = new Config({
				page_id: 'abc'
			})
			config1.persist({
				blah: 5
			})
			const config2 = new Config({
				page_id: 'xyz'
			})
			config2.persist({
				blah: 6
			})
			//test
			const newConfig1 = new Config({
				page_id: 'abc'
			})
			const newConfig2 = new Config({
				page_id: 'xyz'
			})
			expect(newConfig1.blah).toBe(5)
			expect(newConfig2.blah).toBe(6)
		})
	})
})
