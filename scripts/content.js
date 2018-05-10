
////////////////////////////////////////////////////////////////////////////////
///// Utility Functions ////////////////////////////////////////////////////////
function ParseMatchPattern(t){if("string"!=typeof t)return null;var e="(?:^",n=function(t){return t.replace(/[[^$.|?*+(){}\\]/g,"\\$&")},r=/^(\*|https?|file|ftp|chrome-extension):\/\//.exec(t);if(!r)return null;if(t=t.substr(r[0].length),e+="*"===r[1]?"https?://":r[1]+"://","file"!==r[1]){if(!(r=/^(?:\*|(\*\.)?([^\/*]+))(?=\/)/.exec(t)))return null;t=t.substr(r[0].length),"*"===r[0]?e+="[^/]+":(r[1]&&(e+="(?:[^/]+\\.)?"),e+=n(r[2]))}return e+=t.split("*").map(n).join(".*"),e+="$)"}
///// Site Specific Functions /////////////////////////////////////////////////
function Facebook_UnhidePage(){
	for (var e = 0; e < document.styleSheets.length; e++) {
	try{
		if (1 == document.styleSheets[e].rules.length && document.styleSheets[e].rules[0].selectorText == "body *") {
			document.styleSheets[e].deleteRule(0)
		}
	} catch(e){}
	}
}
	//try{for(var e=0;e<document.styleSheets.length;e++)1==document.styleSheets[e].rules.length&&"body *"==document.styleSheets[e].rules[0].selectorText&&document.styleSheets[e].deleteRule(0)}catch(e){}}
function Google_WebApp_HideWarningBar(){setTimeout(function(){$(".warning-bar-content").length>0&&$(".warning-bar-content").css({display:"none"})},1250)}
function Google_WebApp_SetFacebookIdCookie(){chrome.storage.sync.get("FacebookUserId",function(o){"FacebookUserId"in o&&$.cookie("FacebookUserId",o.FacebookUserId,{expires:365,path:"/"})})}
////////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {

	///// Facebook ///////////////////////////////////////////////////////////
	/* Unhide iframed pages */if (location.href.match(ParseMatchPattern("*://www.facebook.com/*"))) {Facebook_UnhidePage()}
	////////////////////////////////////////////////////////////////////////////

	///// Google WebApp's /////////////////////////////////////////////////
	/* Hide Warning Bar */if (location.href.match(ParseMatchPattern("*://script.google.com/*"))) {Google_WebApp_HideWarningBar()}
	/* Set FacebookUserId Cookie */if (location.href.match(ParseMatchPattern("*://*.googleusercontent.com/*"))) {Google_WebApp_SetFacebookIdCookie()}
	////////////////////////////////////////////////////////////////////////////

});
