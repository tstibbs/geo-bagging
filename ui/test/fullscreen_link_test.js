import $ from 'jquery'
import {assert} from 'chai'

import fullscreenLink from '../src/js/fullscreen_link';

describe('fullscreen_link', function() {
    it('should display if container exists', function() {
        var $container = $('<div class="full-screen-link"></div>');
        $('#test-fixture').append($container);
        fullscreenLink(null);
        assert.equal($('a', $container).length, 1);
    });

    it('should not error if container does not exist', function() {
        fullscreenLink(null);
        //assert.expect(0);
    });
});
