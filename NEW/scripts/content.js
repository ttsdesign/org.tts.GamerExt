
////////////////////////////////////////////////////////////////////////////////
///// Utility Functions ////////////////////////////////////////////////////////
function ParseMatchPattern(t){if("string"!=typeof t)return null;var e="(?:^",n=function(t){return t.replace(/[[^$.|?*+(){}\\]/g,"\\$&")},r=/^(\*|https?|file|ftp|chrome-extension):\/\//.exec(t);if(!r)return null;if(t=t.substr(r[0].length),e+="*"===r[1]?"https?://":r[1]+"://","file"!==r[1]){if(!(r=/^(?:\*|(\*\.)?([^\/*]+))(?=\/)/.exec(t)))return null;t=t.substr(r[0].length),"*"===r[0]?e+="[^/]+":(r[1]&&(e+="(?:[^/]+\\.)?"),e+=n(r[2]))}return e+=t.split("*").map(n).join(".*"),e+="$)"}
////////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {

	console.log(document.baseURI);

	///// Facebook ///////////////////////////////////////////////////////////
	/* Unhide iframed pages if (location.href.match(ParseMatchPattern("*://www.facebook.com/*"))) {Facebook_UnhidePage()}*/
	////////////////////////////////////////////////////////////////////////////

});
