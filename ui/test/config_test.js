import {assert} from 'chai'

import Config from "../src/js/config";

describe('config', function() {
    before(function () {
        if (localStorage !== undefined) {
            localStorage.clear();
        }
    });
    it('should inherit defaults', function() {
        var config = new Config();
        assert.equal(true, config.cluster);
        assert.equal(false, config.dimensional_layering);
        assert.equal(undefined, config.blah);
        assert.notOk(config.hasOwnProperty('blah'));
    });
    it('defaults can be overridden', function() {
        var config = new Config({
            cluster: false,
            blah: 'stuff'
        });
        assert.equal(false, config.cluster);
        assert.equal(false, config.dimensional_layering);
        assert.equal('stuff', config.blah);
        assert.ok(config.hasOwnProperty('blah'));
    });
    describe('persistence', function() {
        it('can save and retrieve', function() {
            var config = new Config({
                blah: 4
            });
            assert.equal(4, config.blah);
            config.persist({
                blah: 5
            });
            assert.equal(4, config.blah); //should still be 4 - persisting shouldn't change the retrieved values until we reload the page
            var config2 = new Config({
                blah: 4
            });
            assert.equal(5, config2.blah); //saved value should override the value from config
        });
        it('can save and retrieve with null options', function() {
            var config = new Config();
            config.persist({
                blah: 5
            });
            var config2 = new Config();
            assert.equal(5, config2.blah); //saved value should now be available
        });
        it('can force override', function() {
            var config = new Config();
            config.persist({
                blah: 5
            });
            var config2 = new Config({
                force_config_override: true,
                blah: 4
            });
            assert.equal(4, config2.blah); //passed-in value should override saved value
        });
        it('saving is for a given page id', function() {
            //set up
            var config1 = new Config({
                page_id: 'abc'
            });
            config1.persist({
                blah: 5
            });
            var config2 = new Config({
                page_id: 'xyz'
            });
            config2.persist({
                blah: 6
            });
            //test
            var newConfig1 = new Config({
                page_id: 'abc'
            });
            var newConfig2 = new Config({
                page_id: 'xyz'
            });
            assert.equal(5, newConfig1.blah);
            assert.equal(6, newConfig2.blah);
        });
    });
});
