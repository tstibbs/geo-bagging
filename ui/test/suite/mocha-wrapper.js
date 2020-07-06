import $ from 'jquery'
import 'mocha/mocha.css'
import 'mocha/browser-entry'

let div = $('<div></div>')
div.attr('id', 'mocha')
$('body').append(div)

mocha.setup('bdd');
mocha.checkLeaks();

export const run = mocha.run
