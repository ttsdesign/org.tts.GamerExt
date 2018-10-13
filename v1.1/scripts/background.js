function GetModifierFunctions (cb) {InsertScript(chrome.extension.getURL('ModifierFunctions.json'), function () {cb(window.ModifierFunctions)})}
function InsertScript(src, cb) {var script = document.createElement('script');script.onload = function () {if (typeof cb === 'function') {cb(src)}};script.type = 'text/javascript';script.src = src;document.getElementsByTagName('head')[0].appendChild(script)}
function ParseMatchPattern(t){if("string"!=typeof t)return null;var e="(?:^",n=function(t){return t.replace(/[[^$.|?*+(){}\\]/g,"\\$&")},r=/^(\*|https?|file|ftp|chrome-extension):\/\//.exec(t);if(!r)return null;if(t=t.substr(r[0].length),e+="*"===r[1]?"https?://":r[1]+"://","file"!==r[1]){if(!(r=/^(?:\*|(\*\.)?([^\/*]+))(?=\/)/.exec(t)))return null;t=t.substr(r[0].length),"*"===r[0]?e+="[^/]+":(r[1]&&(e+="(?:[^/]+\\.)?"),e+=n(r[2]))}return e+=t.split("*").map(n).join(".*"),e+="$)"}

// Setup PageAction Button //
chrome.runtime.onInstalled.addListener(function () {chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {chrome.declarativeContent.onPageChanged.addRules([{conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'apps.facebook.com'},	})], actions: [new chrome.declarativeContent.ShowPageAction()]}])})})
chrome.pageAction.onClicked.addListener(function (tab) {chrome.tabs.sendMessage(tab.id, 'ModifyLayout')})

// Add Default Listener for content scripts to request GetModifierFunction //
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message == 'GetModifierFunction') {
		GetModifierFunctions(function (fns) { // Wrapper function for InsertScript... for future dev of fetching def's from a server //
			Object.keys(fns).forEach(function (site) {
				if (sender.url.match(ParseMatchPattern(site)) != null) {
					sendResponse(btoa(fns[site])) // base64 encoding resolved issues of passing js text as-is....
				}
			})
		})
		return true
	}
})
