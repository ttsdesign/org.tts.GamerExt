var MinGamePosts = 20

function Facebook_XTract_Friends () {
	$.Facebook.XTract.Friends(function (data) {
		console.log(data);
		Post("friends", data, console.log);
	});
}

function Facebook_XTract_Posts (date) {
	if (typeof date === 'undefined') {date = Date.now() - 1000*60*60*24*3}
	$.Facebook.XTract.Posts(date, function (data) {
		console.log(data);
		Post("posts", data, function(response){
			console.log(response);
			if (window != parent) {	parent.postMessage({cmd: "Facebook.XTract.Posts", response: response}, "*")}
		});
	});
}

function Facebook_XTract_Summary () {
	$.Facebook.XTract.Summary(Date.now()-1000*60*60*24*10, function (data) {
		console.log(data);
		if (data["Game Posts"] > MinGamePosts) {
			Post("summary", data, console.log);
			if (window != parent) {	parent.postMessage({cmd: "Facebook.XTract.Summary",added:1},"*")}
		} else {
			if (window != parent) {	parent.postMessage({cmd: "Facebook.XTract.Summary",added:0},"*")}
		}
	});
}

function GetParameterByName (name, url) {if (!url) {url = location.href;}name = name.replace(/[\[\]]/g, "\\$&");var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),results = regex.exec(url);if (!results) {return null;}if (!results[2]) { return '';}return decodeURIComponent(results[2].replace(/\+/g, " "));}
function Post (endpoint, data, cb) {var apiUrl = "https://script.google.com/macros/s/AKfycbyQS_TH-D5GGxSkUz00n2tvi2CMyB78t31T7dfNmzV4/dev";var xhr = new XMLHttpRequest();xhr.open("POST", apiUrl+'/'+endpoint, true);	xhr.onreadystatechange = function(){if (xhr.readyState == 4) {cb(JSON.parse(xhr.responseText));}	}; xhr.send(JSON.stringify(data));}
function SetFacebookUserId () {if (location.href=="https://www.facebook.com/") {var id = $("#userNav .sideNavItem").attr("data-nav-item-id");chrome.storage.sync.set({"FacebookUserId": id});}}


$(document).ready(function () {
	SetFacebookUserId();
	
	var cmd = (GetParameterByName('cmd', document.location.href) == null) ? "" : GetParameterByName('cmd', document.location.href);
	if (cmd == 'Facebook.XTract.Friends') {Facebook_XTract_Friends()}
	if (cmd == 'Facebook.XTract.Posts') {Facebook_XTract_Posts(parseInt(GetParameterByName('date', location.href)))}
	if (cmd == 'Facebook.XTract.Summary') {Facebook_XTract_Summary()}

});

window.addEventListener("message", function (event) {
	if (event.data.cmd == "Facebook.XTract.Friends") {Facebook_XTract_Friends()}
	if (event.data.cmd == "Facebook.XTract.Posts") {Facebook_XTract_Posts(event.data.date)}
	if (event.data.cmd == "Facebook.XTract.Summary") {Facebook_XTract_Summary()}
	if(event.data.cmd=="Load"){location.href=event.data.url}
}, false);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.cmd == 'Facebook.XTract.Friends') {Facebook_XTract_Friends()}
	if (message.cmd == 'Facebook.XTract.Posts') {Facebook_XTract_Posts()}
	if (message.cmd == 'Facebook.XTract.Summary') {Facebook_XTract_Summary()}
	if(message.cmd=="Load"){location.href=message.url}
});

// Slotomania Coupon Collect Results
$( window ).on( "load", function() {if(window.parent.parent) {setTimeout(function(){if($('.loginError').length>0){location.reload()}var result=null;	if($('.couponCollectView').length>0){if($(".couponCollectView").hasClass('successCouponCollect')) {result={"Status":"Success","Message":$(".couponCollectView .resultText").text(),"Coins":$($(".couponCollectView .resultItem")[0]).find('b').text().replace(",",""),"Bonus":$($(".couponCollectView .resultItem")[2]).find('b').text(),"Total":$($(".couponCollectView .resultItem")[4]).find('b').text().replace(",",""),"Coupon":GetParameterByName("coupon_token", location.href)}}if($(".couponCollectView").hasClass('failedCouponCollect')){result={"Status":"Fail","Message":$(".couponCollectView .resultText").text(),"Coupon":GetParameterByName("coupon_token",location.href)}}}if(result != null){window.parent.parent.postMessage({api:"gaming.ttscloud.net",cmd:"ClaimResult", result: result},"*")}},4000)}});


/*

function GetCleanUrl () {var id = GetParameterByName('id', document.location.href);var url = document.location.href.split("?")[0];if (id != null) {url+="?id="+id}return url;}
function RemoveURLParameter(url, parameter) {var urlparts= url.split('?'); if (urlparts.length>=2) {var prefix= encodeURIComponent(parameter)+'=';var pars= urlparts[1].split(/[&;]/g); for (var i= pars.length; i-- > 0;) {	if (pars[i].lastIndexOf(prefix, 0) !== -1) {pars.splice(i, 1);} }	url= urlparts[0]+'?'+pars.join('&');	return url; } else {	return url;}	}


var games = ["BINGO Blitz", "Caesars Slots", "House of Fun - Slots", "Slotomania Slot Machines", "WSOP – Texas Holdem Poker"];
var ScrollTimeDelay = 2250, MinGamePosts = 20, count = -1, scrollCount = 0, cmd = (GetParameterByName('cmd', document.location.href) == null) ? "" : GetParameterByName('cmd', document.location.href);

function ScrollFriends () {
	if (count < $.Facebook.Friends().length) {
		count = $.Facebook.Friends().length;
		window.scrollTo(0, document.body.scrollHeight);
		if (scrollCount < ((60/5)*10)) {
			window.setTimeout(ScrollFriends, ScrollTimeDelay);
			scrollCount++;
		}
	}
	else {
		XTractFriends();
	}
}

function ScrollPosts () {
	if (count < $.Facebook.Posts(((cmd == 'Facebook.XTract.Posts')?"Days-Custom":"Days-10")).length) {
		count = $.Facebook.Posts(((cmd == 'Facebook.XTract.Posts')?"Days-Custom":"Days-10")).length;
		window.scrollTo(0, document.body.scrollHeight);
		if (scrollCount < ((60/5)*10)) {
			window.setTimeout(ScrollPosts, ScrollTimeDelay);
			scrollCount++;
		}
	}
	else {
		XTractPosts();
	}
}

function XTractFriends () {
	var ids = $.Facebook.Friends();
	Post("friends",{Id:$.Facebook.UserId,ids:ids},console.log);
}


function XTractPosts () {
	if (cmd == "Facebook.XTract.Posts") {
		var XtractedPosts = [];games.forEach(function (game) {XtractedPosts = XtractedPosts.concat($.Facebook.Posts(game, "Days-Custom").Convert())});
		Post("posts", {"Url": GetCleanUrl(),"Date": Date.now(),"Posts": XtractedPosts}, function(response){if(window!=parent){parent.postMessage({cmd:cmd,response:response},"*")}});
	}
	if (cmd == 'Facebook.XTract.Summary') {
		var data = {Id:$.Facebook.UserId,Url:GetCleanUrl(),"Total Posts":$.Facebook.Posts("Days-10").length,"Game Posts":0};
		games.forEach(function (game) {data[game] = $.Facebook.Posts(game,"Days-10").length;data["Game Posts"] += data[game];});
		if (data["Game Posts"] > MinGamePosts) {
			Post("summary", data, function (response){});
			var XtractedPosts = [];games.forEach(function (game) {XtractedPosts = XtractedPosts.concat($.Facebook.Posts(game, "Days-3").Convert())});
			Post("posts", {"Url": GetCleanUrl(),"Date": Date.now(),"Posts": XtractedPosts}, function(response){});
			if(window!=parent){parent.postMessage({cmd: 'Facebook.XTract.Summary',added:1},"*")}
		} else {	
			if(window!=parent){parent.postMessage({cmd: 'Facebook.XTract.Summary',added:0},"*")}
		}
	}
}
*/






/*

function XTract_Posts () {
	var currentCount =  $.Facebook.Posts("Days-Custom").length; // $.Facebook.Posts("BingoBlitz", "Days-Custom").length + $.Facebook.Posts("Caesars", "Days-Custom").length + $.Facebook.Posts("HouseOfFun", "Days-Custom").length + $.Facebook.Posts("Slotomania", "Days-Custom").length + $.Facebook.Posts("WSOP", "Days-Custom").length;
	if (postsCount < currentCount) {
		postsCount = currentCount;
		window.scrollTo(0, document.body.scrollHeight);
		if (scrollCount < MaxScrollCount) {
			window.setTimeout(XTract_Posts, ScrollTimeDelay);
			scrollCount++;
		}
	} else {
		XtractedPosts = XtractedPosts.concat($.Facebook.Posts("BingoBlitz", "Days-Custom").Convert());
		XtractedPosts = XtractedPosts.concat($.Facebook.Posts("Caesars", "Days-Custom").Convert());
		XtractedPosts = XtractedPosts.concat($.Facebook.Posts("HouseOfFun", "Days-Custom").Convert());
		XtractedPosts = XtractedPosts.concat($.Facebook.Posts("Slotomania", "Days-Custom").Convert());
		XtractedPosts = XtractedPosts.concat($.Facebook.Posts("WSOP", "Days-Custom").Convert());
		var id = GetParameterByName('id', document.location.href);var url = document.location.href.split("?")[0];if (id != null) {url += "?id="+id;}
		Post("posts", {"Url": url, 'Date': Date.now(), 'Posts': XtractedPosts}, function (response) {
			parent.postMessage({cmd:  GetParameterByName('cmd', document.location.href), response: response}, "*");
		});
	}
}

function XTract_Summary () {
	var currentCount =  $.Facebook.Posts("Days-10").length;//$.Facebook.Posts("BingoBlitz", "Days-10").length + $.Facebook.Posts("Caesars", "Days-10").length + $.Facebook.Posts("HouseOfFun", "Days-10").length + $.Facebook.Posts("Slotomania", "Days-10").length + $.Facebook.Posts("WSOP", "Days-10").length;
	if (postsCount < currentCount) {
		postsCount = currentCount;
		window.scrollTo(0, document.body.scrollHeight);
		if (scrollCount < MaxScrollCount) {
			window.setTimeout(XTract_Summary, ScrollTimeDelay*3);
			scrollCount++;
		}
	} else {
		var data = {
			Id: $.Facebook.UserId,
			Url: RemoveURLParameter(location.href, 'cmd').replace(/\?$/, ''),
			'BINGO Blitz': $.Facebook.Posts("BingoBlitz", "Days-10").length,
			'Caesars Slots': $.Facebook.Posts("Caesars", "Days-10").length,
			'House of Fun - Slots': $.Facebook.Posts("HouseOfFun", "Days-10").length,
			'Slotomania Slot Machines': $.Facebook.Posts("Slotomania", "Days-10").length,
			'WSOP - Texas Holdem Poker': $.Facebook.Posts("WSOP", "Days-10").length,
			'Total Posts': $.Facebook.Posts().length,
			'Game Posts': $.Facebook.Posts("BingoBlitz", "Days-10").length + $.Facebook.Posts("Caesars", "Days-10").length + $.Facebook.Posts("HouseOfFun", "Days-10").length + $.Facebook.Posts("Slotomania", "Days-10").length + $.Facebook.Posts("WSOP", "Days-10").length
		};
		console.log(data.Url+" "+data['Total Posts']+","+data['Game Posts']+","+data['Slotomania Slot Machines']);
		var added = 0;
		if (data['Game Posts'] > MinGamePosts) {
			//console.log("\tPosting Summary");
			Post("summary", data, function (response){});
			added = 1;	
			
			XtractedPosts = [];
			XtractedPosts = XtractedPosts.concat($.Facebook.Posts("BingoBlitz", "Days-3").Convert());
			XtractedPosts = XtractedPosts.concat($.Facebook.Posts("Caesars", "Days-3").Convert());
			XtractedPosts = XtractedPosts.concat($.Facebook.Posts("HouseOfFun", "Days-3").Convert());
			XtractedPosts = XtractedPosts.concat($.Facebook.Posts("Slotomania", "Days-3").Convert());
			XtractedPosts = XtractedPosts.concat($.Facebook.Posts("WSOP", "Days-3").Convert());
			var id = GetParameterByName('id', document.location.href);var url = document.location.href.split("?")[0];if (id != null) {url += "?id="+id;}
			//console.log("\tPosting Posts");
			Post("posts", {"Url": url, 'Date': Date.now(), 'Posts': XtractedPosts}, function (response) {});
		}
		
		parent.postMessage({cmd:  'Facebook.XTract.Summary', added: added}, "*");
	}
}
*/



/*
function PostPosts (posts, cb) {
	chrome.storage.sync.get(['ApiUrl'], function (data) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", data['ApiUrl']+'/posts', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				cb(xhr.responseText);
			}
		}
		xhr.send(JSON.stringify(posts));
	});
}

function PostSummary (summary, cb) {
	chrome.storage.sync.get(['ApiUrl'], function (data) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", data['ApiUrl']+'/summary', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				cb(xhr.responseText);
			}
		}
		xhr.send(JSON.stringify(summary));
	});
}
*/


/*
css = '.Toast {visibility: hidden;min-width: 250px;margin-left: -125px;background-color: #333;color: #fff;text-align: center;border-radius: 2px;padding: 16px;position: fixed;z-index: 1;left: 50%;bottom: 30px;font-size: 17px;}\n';
css += '.Toast.show {visibility: visible;-webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;animation: fadein 0.5s, fadeout 0.5s 2.5s;}\n';
css += '@-webkit-keyframes fadein {from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;}}\n';
css += '@keyframes fadein {from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;}}\n';
css += '@-webkit-keyframes fadeout {from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;}}\n';
css += '@keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;}}\n';
var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css; document.getElementsByTagName('head')[0].appendChild(style);

msg = document.createElement("div");
$(msg).addClass("Toast");
$(msg).text("Example Toast");
document.body.appendChild(msg);


function myFunction() {
	$(".Toast").addClass("show");
    setTimeout(function(){ $(".Toast").removeClass("show"); }, 3000);
}

*/
/*
var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = '.jq-toast-wrap,.jq-toast-wrap *{margin:0;padding:0}.jq-toast-wrap{display:block;position:fixed;width:500px;pointer-events:none!important;letter-spacing:normal;z-index:9000!important}.jq-toast-wrap.bottom-left{bottom:20px;left:20px}.jq-toast-wrap.bottom-right{bottom:20px;right:40px}.jq-toast-wrap.top-left{top:20px;left:20px}.jq-toast-wrap.top-right{top:20px;right:40px}.jq-toast-single{display:block;width:100%;padding:10px;margin:0 0 5px;border-radius:4px;font-size:12px;font-family:arial,sans-serif;line-height:17px;position:relative;pointer-events:all!important;background-color:#444;color:#fff}.jq-toast-single h2{font-family:arial,sans-serif;font-size:14px;margin:0 0 7px;background:0 0;color:inherit;line-height:inherit;letter-spacing:normal}.jq-toast-single a{color:#eee;text-decoration:none;font-weight:700;border-bottom:1px solid #fff;padding-bottom:3px;font-size:12px}.jq-toast-single ul{margin:0 0 0 15px;background:0 0;padding:0}.jq-toast-single ul li{list-style-type:disc!important;line-height:17px;background:0 0;margin:0;padding:0;letter-spacing:normal}.close-jq-toast-single{position:absolute;top:3px;right:7px;font-size:14px;cursor:pointer}.jq-toast-loader{display:block;position:absolute;top:-2px;height:5px;width:0%;left:0;border-radius:5px;background:red}.jq-toast-loaded{width:100%}.jq-has-icon{padding:10px 10px 10px 50px;background-repeat:no-repeat;background-position:10px}.jq-icon-info{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=);background-color:#31708f;color:#d9edf7;border-color:#bce8f1}.jq-icon-warning{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=);background-color:#8a6d3b;color:#fcf8e3;border-color:#faebcc}.jq-icon-error{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=);background-color:#a94442;color:#f2dede;border-color:#ebccd1}.jq-icon-success{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==);color:#dff0d8;background-color:#3c763d;border-color:#d6e9c6}'; document.getElementsByTagName('head')[0].appendChild(style);
"function"!=typeof Object.create&&(Object.create=function(t){function o(){}return o.prototype=t,new o}),function(t,o,i,s){"use strict";var n={_positionClasses:["bottom-left","bottom-right","top-right","top-left","bottom-center","top-center","mid-center"],_defaultIcons:["success","error","info","warning"],init:function(o,i){this.prepareOptions(o,t.toast.options),this.process()},prepareOptions:function(o,i){var s={};"string"==typeof o||o instanceof Array?s.text=o:s=o,this.options=t.extend({},i,s)},process:function(){this.setup(),this.addToDom(),this.position(),this.bindToast(),this.animate()},setup:function(){var o="";if(this._toastEl=this._toastEl||t("<div></div>",{class:"jq-toast-single"}),o+='<span class="jq-toast-loader"></span>',this.options.allowToastClose&&(o+='<span class="close-jq-toast-single">&times;</span>'),this.options.text instanceof Array){this.options.heading&&(o+='<h2 class="jq-toast-heading">'+this.options.heading+"</h2>"),o+='<ul class="jq-toast-ul">';for(var i=0;i<this.options.text.length;i++)o+='<li class="jq-toast-li" id="jq-toast-item-'+i+'">'+this.options.text[i]+"</li>";o+="</ul>"}else this.options.heading&&(o+='<h2 class="jq-toast-heading">'+this.options.heading+"</h2>"),o+=this.options.text;this._toastEl.html(o),!1!==this.options.bgColor&&this._toastEl.css("background-color",this.options.bgColor),!1!==this.options.textColor&&this._toastEl.css("color",this.options.textColor),this.options.textAlign&&this._toastEl.css("text-align",this.options.textAlign),!1!==this.options.icon&&(this._toastEl.addClass("jq-has-icon"),-1!==t.inArray(this.options.icon,this._defaultIcons)&&this._toastEl.addClass("jq-icon-"+this.options.icon)),!1!==this.options.class&&this._toastEl.addClass(this.options.class)},position:function(){"string"==typeof this.options.position&&-1!==t.inArray(this.options.position,this._positionClasses)?"bottom-center"===this.options.position?this._container.css({left:t(o).outerWidth()/2-this._container.outerWidth()/2,bottom:20}):"top-center"===this.options.position?this._container.css({left:t(o).outerWidth()/2-this._container.outerWidth()/2,top:20}):"mid-center"===this.options.position?this._container.css({left:t(o).outerWidth()/2-this._container.outerWidth()/2,top:t(o).outerHeight()/2-this._container.outerHeight()/2}):this._container.addClass(this.options.position):"object"==typeof this.options.position?this._container.css({top:this.options.position.top?this.options.position.top:"auto",bottom:this.options.position.bottom?this.options.position.bottom:"auto",left:this.options.position.left?this.options.position.left:"auto",right:this.options.position.right?this.options.position.right:"auto"}):this._container.addClass("bottom-left")},bindToast:function(){var t=this;this._toastEl.on("afterShown",function(){t.processLoader()}),this._toastEl.find(".close-jq-toast-single").on("click",function(o){o.preventDefault(),"fade"===t.options.showHideTransition?(t._toastEl.trigger("beforeHide"),t._toastEl.fadeOut(function(){t._toastEl.trigger("afterHidden")})):"slide"===t.options.showHideTransition?(t._toastEl.trigger("beforeHide"),t._toastEl.slideUp(function(){t._toastEl.trigger("afterHidden")})):(t._toastEl.trigger("beforeHide"),t._toastEl.hide(function(){t._toastEl.trigger("afterHidden")}))}),"function"==typeof this.options.beforeShow&&this._toastEl.on("beforeShow",function(){t.options.beforeShow(t._toastEl)}),"function"==typeof this.options.afterShown&&this._toastEl.on("afterShown",function(){t.options.afterShown(t._toastEl)}),"function"==typeof this.options.beforeHide&&this._toastEl.on("beforeHide",function(){t.options.beforeHide(t._toastEl)}),"function"==typeof this.options.afterHidden&&this._toastEl.on("afterHidden",function(){t.options.afterHidden(t._toastEl)}),"function"==typeof this.options.onClick&&this._toastEl.on("click",function(){t.options.onClick(t._toastEl)})},addToDom:function(){var o=t(".jq-toast-wrap");if(0===o.length?(o=t("<div></div>",{class:"jq-toast-wrap",role:"alert","aria-live":"polite"}),t("body").append(o)):this.options.stack&&!isNaN(parseInt(this.options.stack,10))||o.empty(),o.find(".jq-toast-single:hidden").remove(),o.append(this._toastEl),this.options.stack&&!isNaN(parseInt(this.options.stack),10)){var i=o.find(".jq-toast-single").length-this.options.stack;i>0&&t(".jq-toast-wrap").find(".jq-toast-single").slice(0,i).remove()}this._container=o},canAutoHide:function(){return!1!==this.options.hideAfter&&!isNaN(parseInt(this.options.hideAfter,10))},processLoader:function(){if(!this.canAutoHide()||!1===this.options.loader)return!1;var t=this._toastEl.find(".jq-toast-loader"),o=(this.options.hideAfter-400)/1e3+"s",i=this.options.loaderBg,s=t.attr("style")||"";s=s.substring(0,s.indexOf("-webkit-transition")),s+="-webkit-transition: width "+o+" ease-in;                       -o-transition: width "+o+" ease-in;                       transition: width "+o+" ease-in;                       background-color: "+i+";",t.attr("style",s).addClass("jq-toast-loaded")},animate:function(){var t=this;if(this._toastEl.hide(),this._toastEl.trigger("beforeShow"),"fade"===this.options.showHideTransition.toLowerCase()?this._toastEl.fadeIn(function(){t._toastEl.trigger("afterShown")}):"slide"===this.options.showHideTransition.toLowerCase()?this._toastEl.slideDown(function(){t._toastEl.trigger("afterShown")}):this._toastEl.show(function(){t._toastEl.trigger("afterShown")}),this.canAutoHide()){t=this;o.setTimeout(function(){"fade"===t.options.showHideTransition.toLowerCase()?(t._toastEl.trigger("beforeHide"),t._toastEl.fadeOut(function(){t._toastEl.trigger("afterHidden")})):"slide"===t.options.showHideTransition.toLowerCase()?(t._toastEl.trigger("beforeHide"),t._toastEl.slideUp(function(){t._toastEl.trigger("afterHidden")})):(t._toastEl.trigger("beforeHide"),t._toastEl.hide(function(){t._toastEl.trigger("afterHidden")}))},this.options.hideAfter)}},reset:function(o){"all"===o?t(".jq-toast-wrap").remove():this._toastEl.remove()},update:function(t){this.prepareOptions(t,this.options),this.setup(),this.bindToast()},close:function(){this._toastEl.find(".close-jq-toast-single").click()}};t.toast=function(t){var o=Object.create(n);return o.init(t,this),{reset:function(t){o.reset(t)},update:function(t){o.update(t)},close:function(){o.close()}}},t.toast.options={text:"",heading:"",showHideTransition:"fade",allowToastClose:!0,hideAfter:3e3,loader:!0,loaderBg:"#9EC600",stack:5,position:"bottom-left",bgColor:!1,textColor:!1,textAlign:"left",icon:!1,beforeShow:function(){},afterShown:function(){},beforeHide:function(){},afterHidden:function(){},onClick:function(){}}}(jQuery,window,document);
$.toast('Here you can put the text of the toast')
$.toast({
    heading: 'Information',
    text: 'Now you can add icons to generate different kinds of toasts',
    showHideTransition: 'slide',
    icon: 'info'
})

var css = `
.jq-toast-wrap { display: block; position: fixed; width: 250px;  pointer-events: none !important; margin: 0; padding: 0; letter-spacing: normal; z-index: 9000 !important; }
.jq-toast-wrap * { margin: 0; padding: 0; }

.jq-toast-wrap.bottom-left { bottom: 20px; left: 20px; }
.jq-toast-wrap.bottom-right { bottom: 20px; right: 40px; }
.jq-toast-wrap.top-left { top: 20px; left: 20px; }
.jq-toast-wrap.top-right { top: 20px; right: 40px; }

.jq-toast-single { display: block; width: 100%; padding: 10px; margin: 0px 0px 5px; border-radius: 4px; font-size: 12px; font-family: arial, sans-serif; line-height: 17px; position: relative;  pointer-events: all !important; background-color: #444444; color: white; }

.jq-toast-single h2 { font-family: arial, sans-serif; font-size: 14px; margin: 0px 0px 7px; background: none; color: inherit; line-height: inherit; letter-spacing: normal; }
.jq-toast-single a { color: #eee; text-decoration: none; font-weight: bold; border-bottom: 1px solid white; padding-bottom: 3px; font-size: 12px; }

.jq-toast-single ul { margin: 0px 0px 0px 15px; background: none; padding:0px; }
.jq-toast-single ul li { list-style-type: disc !important; line-height: 17px; background: none; margin: 0; padding: 0; letter-spacing: normal; }

.close-jq-toast-single { position: absolute; top: 3px; right: 7px; font-size: 14px; cursor: pointer; }

.jq-toast-loader { display: block; position: absolute; top: -2px; height: 5px; width: 0%; left: 0; border-radius: 5px; background: red; }
.jq-toast-loaded { width: 100%; }
.jq-has-icon { padding: 10px 10px 10px 50px; background-repeat: no-repeat; background-position: 10px; }
.jq-icon-info { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII='); background-color: #31708f; color: #d9edf7; border-color: #bce8f1; }
.jq-icon-warning { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII='); background-color: #8a6d3b; color: #fcf8e3; border-color: #faebcc; }
.jq-icon-error { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII='); background-color: #a94442; color: #f2dede; border-color: #ebccd1; }
.jq-icon-success { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg=='); color: #dff0d8; background-color: #3c763d; border-color: #d6e9c6; }
`;

var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css; document.getElementsByTagName('head')[0].appendChild(style);
"function"!=typeof Object.create&&(Object.create=function(t){function o(){}return o.prototype=t,new o}),function(t,o,i,s){"use strict";var n={_positionClasses:["bottom-left","bottom-right","top-right","top-left","bottom-center","top-center","mid-center"],_defaultIcons:["success","error","info","warning"],init:function(o,i){this.prepareOptions(o,t.toast.options),this.process()},prepareOptions:function(o,i){var s={};"string"==typeof o||o instanceof Array?s.text=o:s=o,this.options=t.extend({},i,s)},process:function(){this.setup(),this.addToDom(),this.position(),this.bindToast(),this.animate()},setup:function(){var o="";if(this._toastEl=this._toastEl||t("<div></div>",{class:"jq-toast-single"}),o+='<span class="jq-toast-loader"></span>',this.options.allowToastClose&&(o+='<span class="close-jq-toast-single">&times;</span>'),this.options.text instanceof Array){this.options.heading&&(o+='<h2 class="jq-toast-heading">'+this.options.heading+"</h2>"),o+='<ul class="jq-toast-ul">';for(var i=0;i<this.options.text.length;i++)o+='<li class="jq-toast-li" id="jq-toast-item-'+i+'">'+this.options.text[i]+"</li>";o+="</ul>"}else this.options.heading&&(o+='<h2 class="jq-toast-heading">'+this.options.heading+"</h2>"),o+=this.options.text;this._toastEl.html(o),!1!==this.options.bgColor&&this._toastEl.css("background-color",this.options.bgColor),!1!==this.options.textColor&&this._toastEl.css("color",this.options.textColor),this.options.textAlign&&this._toastEl.css("text-align",this.options.textAlign),!1!==this.options.icon&&(this._toastEl.addClass("jq-has-icon"),-1!==t.inArray(this.options.icon,this._defaultIcons)&&this._toastEl.addClass("jq-icon-"+this.options.icon)),!1!==this.options.class&&this._toastEl.addClass(this.options.class)},position:function(){"string"==typeof this.options.position&&-1!==t.inArray(this.options.position,this._positionClasses)?"bottom-center"===this.options.position?this._container.css({left:t(o).outerWidth()/2-this._container.outerWidth()/2,bottom:20}):"top-center"===this.options.position?this._container.css({left:t(o).outerWidth()/2-this._container.outerWidth()/2,top:20}):"mid-center"===this.options.position?this._container.css({left:t(o).outerWidth()/2-this._container.outerWidth()/2,top:t(o).outerHeight()/2-this._container.outerHeight()/2}):this._container.addClass(this.options.position):"object"==typeof this.options.position?this._container.css({top:this.options.position.top?this.options.position.top:"auto",bottom:this.options.position.bottom?this.options.position.bottom:"auto",left:this.options.position.left?this.options.position.left:"auto",right:this.options.position.right?this.options.position.right:"auto"}):this._container.addClass("bottom-left")},bindToast:function(){var t=this;this._toastEl.on("afterShown",function(){t.processLoader()}),this._toastEl.find(".close-jq-toast-single").on("click",function(o){o.preventDefault(),"fade"===t.options.showHideTransition?(t._toastEl.trigger("beforeHide"),t._toastEl.fadeOut(function(){t._toastEl.trigger("afterHidden")})):"slide"===t.options.showHideTransition?(t._toastEl.trigger("beforeHide"),t._toastEl.slideUp(function(){t._toastEl.trigger("afterHidden")})):(t._toastEl.trigger("beforeHide"),t._toastEl.hide(function(){t._toastEl.trigger("afterHidden")}))}),"function"==typeof this.options.beforeShow&&this._toastEl.on("beforeShow",function(){t.options.beforeShow(t._toastEl)}),"function"==typeof this.options.afterShown&&this._toastEl.on("afterShown",function(){t.options.afterShown(t._toastEl)}),"function"==typeof this.options.beforeHide&&this._toastEl.on("beforeHide",function(){t.options.beforeHide(t._toastEl)}),"function"==typeof this.options.afterHidden&&this._toastEl.on("afterHidden",function(){t.options.afterHidden(t._toastEl)}),"function"==typeof this.options.onClick&&this._toastEl.on("click",function(){t.options.onClick(t._toastEl)})},addToDom:function(){var o=t(".jq-toast-wrap");if(0===o.length?(o=t("<div></div>",{class:"jq-toast-wrap",role:"alert","aria-live":"polite"}),t("body").append(o)):this.options.stack&&!isNaN(parseInt(this.options.stack,10))||o.empty(),o.find(".jq-toast-single:hidden").remove(),o.append(this._toastEl),this.options.stack&&!isNaN(parseInt(this.options.stack),10)){var i=o.find(".jq-toast-single").length-this.options.stack;i>0&&t(".jq-toast-wrap").find(".jq-toast-single").slice(0,i).remove()}this._container=o},canAutoHide:function(){return!1!==this.options.hideAfter&&!isNaN(parseInt(this.options.hideAfter,10))},processLoader:function(){if(!this.canAutoHide()||!1===this.options.loader)return!1;var t=this._toastEl.find(".jq-toast-loader"),o=(this.options.hideAfter-400)/1e3+"s",i=this.options.loaderBg,s=t.attr("style")||"";s=s.substring(0,s.indexOf("-webkit-transition")),s+="-webkit-transition: width "+o+" ease-in;                       -o-transition: width "+o+" ease-in;                       transition: width "+o+" ease-in;                       background-color: "+i+";",t.attr("style",s).addClass("jq-toast-loaded")},animate:function(){var t=this;if(this._toastEl.hide(),this._toastEl.trigger("beforeShow"),"fade"===this.options.showHideTransition.toLowerCase()?this._toastEl.fadeIn(function(){t._toastEl.trigger("afterShown")}):"slide"===this.options.showHideTransition.toLowerCase()?this._toastEl.slideDown(function(){t._toastEl.trigger("afterShown")}):this._toastEl.show(function(){t._toastEl.trigger("afterShown")}),this.canAutoHide()){t=this;o.setTimeout(function(){"fade"===t.options.showHideTransition.toLowerCase()?(t._toastEl.trigger("beforeHide"),t._toastEl.fadeOut(function(){t._toastEl.trigger("afterHidden")})):"slide"===t.options.showHideTransition.toLowerCase()?(t._toastEl.trigger("beforeHide"),t._toastEl.slideUp(function(){t._toastEl.trigger("afterHidden")})):(t._toastEl.trigger("beforeHide"),t._toastEl.hide(function(){t._toastEl.trigger("afterHidden")}))},this.options.hideAfter)}},reset:function(o){"all"===o?t(".jq-toast-wrap").remove():this._toastEl.remove()},update:function(t){this.prepareOptions(t,this.options),this.setup(),this.bindToast()},close:function(){this._toastEl.find(".close-jq-toast-single").click()}};t.toast=function(t){var o=Object.create(n);return o.init(t,this),{reset:function(t){o.reset(t)},update:function(t){o.update(t)},close:function(){o.close()}}},t.toast.options={text:"",heading:"",showHideTransition:"fade",allowToastClose:!0,hideAfter:3e3,loader:!0,loaderBg:"#9EC600",stack:5,position:"bottom-left",bgColor:!1,textColor:!1,textAlign:"left",icon:!1,beforeShow:function(){},afterShown:function(){},beforeHide:function(){},afterHidden:function(){},onClick:function(){}}}(jQuery,window,document);


*/
