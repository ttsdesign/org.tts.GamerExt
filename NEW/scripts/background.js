
/***** Installation Setup *****************************************************/
chrome.runtime.onInstalled.addListener(function (details) {
	chrome.storage.sync.set({'GameApps': JSON.stringify({})});
});
/******************************************************************************/
