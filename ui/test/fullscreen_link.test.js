import $ from 'jquery'
import fullscreenLink from '../src/js/fullscreen_link.js'

describe('fullscreen_link', () => {
	let $fixture
	beforeEach(() => {
		$fixture = $('<div id="test-fixture"></div>')
		$('body').append($fixture)
	})
	afterEach(() => {
		$fixture.remove()
	})

	test('should display if container exists', () => {
		const $container = $('<div class="full-screen-link"></div>')
		$('#test-fixture').append($container)
		fullscreenLink(null)
		expect($('a', $container).length).toBe(1)
	})

	test('should not error if container does not exist', () => {
		expect(() => {
			fullscreenLink(null)
		}).not.toThrow()
	})
})
