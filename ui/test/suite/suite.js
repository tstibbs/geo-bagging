import $ from 'jquery'

beforeEach(function(done) {
    let fixture = $('<div></div')
    fixture.attr("id","test-fixture");
    $('body').append(fixture)
    done();
})
afterEach(function(done) {
    $('#test-fixture', $('body')).empty()
    done();
})

import '../config_test'
import '../conversion_test.js'
//import '../controls_test'
//import '../error_handler_test.js'
import '../fullscreen_link_test.js'
//import '../layers_test.js'
//import '../loader_test.js'
//import '../map_view_test.js'
//import '../mobile_test.js'
//import '../mouseposition_osgb_test.js'
//import '../params_test.js'
//import '../points_view_test.js'
//import '../screenposition_osgb_test.js'

