
function Modifier (cb) {
	var $modified = false, $f = function (){}, $this = {};

	// Define Modifier Properties //
	Object.defineProperty($this, 'F', {configurable: false, enumerable: false, get: function () {return $f}})
	Object.defineProperty($this, 'Modified', {configurable: false, enumerable: false, get: function () {return $modified}})
	Object.defineProperty($this, 'Modify', {configurable: false, enumerable: false, value: function () {this.F(this.Modified);$modified=!$modified;}})

	// Add listeners for Modify Requests from background script //
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {if (request == "ModifyLayout") {$this.Modify()}})

	// Get modifier function //
	chrome.runtime.sendMessage('GetModifierFunction', function (f) {$f = new Function('restore', atob(f));	if (typeof cb === 'function') {cb($this)}})

	// Return object reference //
	return $this

}


$(document).ready(function() {
	window.$modifier = new Modifier(function (modifier) {
		modifier.Modify()
	})
})


