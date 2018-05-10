/*
var eBM = chrome.contextMenus.create({
	'documentUrlPatterns': ['*://www.facebook.com/*'],
	'id': 'FACEBOOK_CM',
	'title': 'Bonus Collector',
	'type': 'normal',
	'contexts': ['page','selection','link','editable','image','video','audio'] });
chrome.contextMenus.onClicked.addListener(function (info, tab) {
	if (info.menuItemId == 'CM_EBM') {
		Toast('Finally Toastered!!!#@$');
	}
});
*/

/***** Security Headers Control ***********************************************/
var WebRequestHeaders = {'Urls': ['*://*.facebook.com/*', '*://*.gamehunters.club/*'],'Types': ['main_frame', 'sub_frame'],'Options': ['blocking', 'responseHeaders']};
chrome.storage.sync.get('WebRequestHeaders', function (storage) {
	if (!('WebRequestHeaders' in storage)) {storage={'WebRequestHeaders': WebRequestHeaders};}
	chrome.webRequest.onHeadersReceived.addListener(RemoveSecurityHeaders, {	urls: storage.WebRequestHeaders.Urls, types: storage.WebRequestHeaders.Types}, storage.WebRequestHeaders.Options);
});
function RemoveSecurityHeaders (info) {
	var headers = info.responseHeaders;
	//console.log(headers);
	var index = headers.findIndex(x=>x.name.toLowerCase() == "x-frame-options");
	if (index !=-1) {headers.splice(index, 1)}
	var index = headers.findIndex(x=>x.name.toLowerCase() == "content-security-policy");
	if (index !=-1) {headers.splice(index, 1)}

/*
	var index = headers.findIndex(x=>x.name.toLowerCase() == "cookie");
	if (index !=-1) {
		console.log("Found Cookies..."+headers[index]);
		headers[index] += "; TTS=Design";
		console.log("\t>"+headers[index]);
	} else {
		headers.push({name: "Set-Cookie", value: "TTS=Design"});
	}
	*/
	headers.push({name: "Set-Cookie", value: "TTS=Design"});

	//console.log(headers);
	//console.log("");

	return {responseHeaders: headers};
}
/******************************************************************************/

/***** Facebook User Id Control ***********************************************/
function SetFacebookUserId () {f=document.createElement('iframe');f.src="https://www.facebook.com";f.id="FacebookId";document.body.append(f);chrome.storage.onChanged.addListener(StorageListener);}
function StorageListener (changes, areaName) {if ((areaName == "sync") && ('FacebookUserId' in changes)) {if ($('#FacebookId').length > 0) {f=$("#FacebookId")[0];f.remove();delete f;RemoveStorageListener();}}}
function RemoveStorageListener () {chrome.storage.onChanged.removeListener(StorageListener);}
/******************************************************************************/


/***** Installation Setup *****************************************************/
chrome.runtime.onInstalled.addListener(function (details) {
	chrome.storage.sync.set({'WebRequestHeaders': WebRequestHeaders});
	SetFacebookUserId()
});
/******************************************************************************/


chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
	//console.log("Message External");
	//console.log(request);
	sendResponse({version: 1.0});
	return true;
});


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.cmd == 'Download.Pics') {
		message.urls.forEach(function (e, i) {
			var filename = e.split("?")[0].split("/").pop();
			chrome.downloads.download({url: e, filename: "fb/"+message.username+"/"+filename});
		});
	}
	if (message.cmd == 'Download.Pics2') {
		message.urls.forEach(function (e, i) {
			chrome.downloads.download({url: "https://graph.facebook.com/"+e+"/picture?fields=picture.type(large)", filename: "fb/"+message.username+"/"+e+".jpg"});
		});
	}
});




/***** Security Headers Control ***********************************************/
chrome.webRequest.onBeforeRequest.addListener(BlockFbImages, {urls: ["*://*.fbcdn.net/*"], types:["sub_frame","image"]}, ['blocking']);
function BlockFbImages (details) {
	if (details.frameId > 0) {
		//console.log(details.frameId+"::"+details.type+"::"+details.url);
		if (details.type == 'image') {return {cancel: true};}
	}
}
/******************************************************************************/



function genericOnClick(info, tab) {
	console.log(info.menuItemId);
	if (info.menuItemId == menuIds["XTract.Posts"]) {
		chrome.tabs.sendMessage(tab.id, {"cmd":"Facebook.XTract.Posts", "date": Date.now()-1000*60*60*24*3}, {"frameId":0});
	}
	if (info.menuItemId == menuIds["XTract.Summary"]) {
		chrome.tabs.sendMessage(tab.id, {"cmd":"Facebook.XTract.Summary"}, {"frameId":0});
	}
	if (info.menuItemId == menuIds["XTract.Friends"]) {
		chrome.tabs.sendMessage(tab.id, {"cmd":"Facebook.XTract.Friends"}, {"frameId":0});
	}
}
var contexts = ["page","selection","link","editable","image","video","audio"];

var menuIds = {};
menuIds["XTract.Posts"] = chrome.contextMenus.create({"title": "XTract Posts", "documentUrlPatterns": ["*://www.facebook.com/*"], "contexts": ["all"],"onclick": function (info, tab) {
	chrome.tabs.sendMessage(tab.id, {"cmd":"Facebook.XTract.Posts", "date": Date.now()-1000*60*60*24*3}, {"frameId":0});
}});
menuIds["XTract.Summary"] = chrome.contextMenus.create({"title": "XTract Summary", "documentUrlPatterns": ["*://www.facebook.com/*"], "contexts":["all"],"onclick": function (info, tab) {
	chrome.tabs.sendMessage(tab.id, {"cmd":"Facebook.XTract.Summary"}, {"frameId":0});
}});
menuIds["XTract.Friends"] = chrome.contextMenus.create({"title": "XTract Friends", "documentUrlPatterns": ["*://www.facebook.com/*"], "contexts": ["all"],"onclick": function (info, tab) {
	chrome.tabs.sendMessage(tab.id, {"cmd":"Facebook.XTract.Friends"}, {"frameId":0});
}});
menuIds["Facebook.User"] = chrome.contextMenus.create({"title": "Set Facebook User", "contexts": ["all"] ,"onclick": function (info, tab) {
	var d = document.createElement("iframe");
	$(d).css({width: "90%", height: "250px"});
	d.onload = function () {
		//console.log("fb ready");
	};
	$("body").append(d);

	d.src = "https://www.facebook.com";
	//console.log("Change Facebook User");
}});



/*
var facebookUser = "jenni@ttsdesign.net", facebookPassword = "115design", injectCount = 0;
var userTabId;
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tabId == userTabId) {
		console.log(injectCount);
		if (injectCount < 2) {
			var code = 'if ($("#pageLoginAnchor").length > 0) {document.getElementById("pageLoginAnchor").click();setTimeout(function() {document.getElementsByClassName("_54nc")[document.getElementsByClassName("_54nc").length - 1].click()}, 500);}';
			code += 'if (($("#email").length > 0) && ($("#pass").length > 0)) {$("#email").val("'+facebookUser+'");$("#pass").val("'+facebookPassword+'");$("#"+$("#loginbutton").attr("for"))[0].click();}';
			chrome.tabs.executeScript(tab.id, {code: code});
			injectCount++;
		}
	}
});

chrome.windows.getCurrent(function (window) {
	injectCount = 0;
	chrome.tabs.create({windowId: window.id, url: "https://www.facebook.com"}, function (tab) {
		userTabId = tab.id;
		console.log(tab.id);
		chrome.tabs.executeScript(tab.id, {code: 'console.log("hello from tab...")'})
	});
});

var user, pass;
'if (($("#email").length > 0) && ($("#pass").length > 0)) {$("#email").val('+user+');$("#pass").val('+pass+');$("#"+$("#loginbutton").attr("for"))[0].click();}';


javascript: (function() {
    function FacebookLogin(user, pass) {
        document.getElementById("email").value = user;
        document.getElementById("pass").value = pass;
        document.getElementById(document.getElementById("loginbutton").getAttribute("for")).click();
    }
    var emails = ["mac@images.spirit-vapes.org", "skip@ttsdesign.net", "hstylez@ttsdesign.net", "jenni@ttsdesign.net", "jc@ttscloud.net", "tdarby@ttscloud.net", "johnf@ttscloud.net", "fs@members.ttscloud.net", "nhansens@ttsdesign.net", "dave@ttscloud.net", "alasso@members.ttscloud.net"];
    FacebookLogin(emails[Math.floor(Math.random() * emails.length)], "115design");
}());

*/

