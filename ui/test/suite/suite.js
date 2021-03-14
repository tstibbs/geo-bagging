import $ from 'jquery'

const karmaMode = global['describe'] != undefined

async function runTests() {
	let mocha = null
	if (!karmaMode) {
		mocha = await import('./mocha-wrapper.js') //it puts everything into global, but just needs to be loaded before the tests
	}

	beforeEach(function (done) {
		let fixture = $('<div></div')
		fixture.attr('id', 'test-fixture')
		$('body').append(fixture)
		done()
	})
	afterEach(function (done) {
		$('#test-fixture', $('body')).empty()
		done()
	})

	await import('../config_test.js')
	await import('../conversion_test.js')
	await import('../fullscreen_link_test.js')
	//'../controls_test'
	//'../error_handler_test.js'
	//'../layers_test.js'
	//'../loader_test.js'
	//'../map_view_test.js'
	//'../mobile_test.js'
	//'../mouseposition_osgb_test.js'
	//'../params_test.js'
	//'../points_view_test.js'
	//'../screenposition_osgb_test.js'

	if (!karmaMode) {
		mocha.run()
	}
}

runTests()
