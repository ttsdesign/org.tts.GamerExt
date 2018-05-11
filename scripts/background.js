
/***** Install Initializations ******************************************************/
chrome.runtime.onInstalled.addListener(function (details) {
		function SetFacebookUserId () {

		function StorageListener (changes, areaName) {
			if (areaName == "sync" && ('FacebookUserId' in changes)) {
				if ($('#FacebookId').length > 0) {
					$("#FacebookId")[0].remove();
					RemoveStorageListener();
				}
			}
		}

		function RemoveStorageListener () {
			chrome.storage.onChanged.removeListener(StorageListener)
		}

		var f=document.createElement('iframe');
		f.src="https://www.facebook.com";
		f.id="FacebookId";
		document.body.append(f);
		chrome.storage.onChanged.addListener(StorageListener);

	}
});
/******************************************************************************/

/***** WebRequest Controls *****************************************************/
chrome.webRequest.onBeforeRequest.addListener(
	function (details) {
		if (details.frameId > 0) {
			if (details.type == 'image') {
				return {cancel: true}
			}
		}
	},
	{
		urls: ["*://*.fbcdn.net/*"],
		types: ["sub_frame","image"]
	},
	['blocking']
);

chrome.webRequest.onHeadersReceived.addListener(
	function (info) {
		var headers = info.responseHeaders;
		var index = headers.findIndex(x=>x.name.toLowerCase() == "x-frame-options");
		if (index !=-1) {headers.splice(index, 1)}
		var index = headers.findIndex(x=>x.name.toLowerCase() == "content-security-policy");
		if (index !=-1) {headers.splice(index, 1)}
		return {responseHeaders: headers};
	}, 
	{
		urls: ['*://*.facebook.com/*', '*://*.gamehunters.club/*'],
		types: ['main_frame', 'sub_frame']
	},
	['blocking', 'responseHeaders']
);
/******************************************************************************/

/***** Facebook Context Menus *************************************************/
function SendCommand (tabId, cmd, date) {
	date = date || Date.now()-1000*60*60*24*3;
	chrome.tabs.sendMessage(tabId, {"cmd": cmd, "date": date}, {"frameId": 0});
}

var menuIds = {};
menuIds["XTract.Posts"] = chrome.contextMenus.create({
	"title": "XTract Posts",
	"documentUrlPatterns": ["*://www.facebook.com/*"],
	"contexts": ["all"],
	"onclick": function (info, tab) {
		SendCommand(tab.id, "Facebook.XTract.Posts");
	}
});

menuIds["XTract.Summary"] = chrome.contextMenus.create({
	"title": "XTract Summary",
	"documentUrlPatterns": ["*://www.facebook.com/*"],
	"contexts": ["all"],
	"onclick": function (info, tab) {
		SendCommand(tab.id, "Facebook.XTract.Summary");
	}
});

menuIds["XTract.Friends"] = chrome.contextMenus.create({
	"title": "XTract Friends",
	"documentUrlPatterns": ["*://www.facebook.com/*"],
	"contexts": ["all"],
	"onclick": function (info, tab) {
		SendCommand(tab.id, "Facebook.XTract.Friends");
	}
});
/******************************************************************************/

/***** External Message Handling ***********************************************/
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
	sendResponse({version: 1.0});
	return true;
});
/******************************************************************************/
