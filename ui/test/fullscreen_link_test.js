define(['fullscreen_link'],
	function(fullscreenLink) {
		QUnit.module('fullscreen_link', function() {
			QUnit.test('should display if container exists', function (assert) {
				var $container = $('<div class="full-screen-link"></div>');
				$('#qunit-fixture').append($container);
				fullscreenLink(null);
				assert.equal($('a', $container).length, 1);
			});
			
			QUnit.test('should not error if container does not exist', function (assert) {
				fullscreenLink(null);
				assert.expect(0);
			});
		});
	}
);
