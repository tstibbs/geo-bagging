// This file must have no dependencies and must be loaded first, so it can warn of any issues loading dependent libraries

var functionsToWrap = ['log', 'error', 'warn'];

var outerThis = this;
var bufferedMessages = [];//if the dom isn't ready yet, we'll buffer up the messages to replay later

document.addEventListener("DOMContentLoaded", function(event) {
	//document.onload = function() {
	addErrorHandler();
});

function addErrorHandler() {
	var dismissButton = document.querySelector('div#error-container a#dismiss-button');
	if (dismissButton != null) {
		dismissButton.onclick = function () {
			document.getElementById('error-container').style.display = 'none';
			return false;
		};
		for (var i = 0; i < bufferedMessages.length; i++) {
			displayError(bufferedMessages);
		}
	} else {
		setTimeout(addErrorHandler.bind(this), 1000);//just keep checking, it won't be long
	}
}

function displayError() {
	var args = Array.prototype.slice.call(arguments);
	var container = document.getElementById('error-container');
	if (container != null) {
		var elem = document.createElement('p');
		elem.className = 'error';
		var message = args.join(" | ");
		elem.innerHTML = message;
		var list = document.getElementById('errors-list');
		list.appendChild(elem);
		container.style.display = 'block'; //may already be showing, but that's fine
	} else {
		//if the dom isn't ready yet, let's buffer the messages up for now
		bufferedMessages.push(args);
	}
}

if (window.console != null) {
	for (var i = 0; i < functionsToWrap.length; i++) {
		var func = functionsToWrap[i];
		if (window.console[func] != null) {
			(function(func, old) {//scoping old
				window.console[func] = function() {
					old.apply(this, arguments);//log first in case our displayer mucks something up
					displayError.apply(outerThis, arguments);
				}
			})(func, window.console[func]);
		}
	}
}

window.onerror = function (message, file, line, col, error) {
	displayError.apply(outerThis, [message, file, error]);
};
window.addEventListener("error", function (e) {
	displayError.apply(outerThis, e);
});
