import $ from 'jquery';
import trigpointingBase from './config_base';

export default function build(config) {
	return $.extend({}, trigpointingBase(config), {dataToLoad: 'data_all.json'});
}
