(function (factory) {factory(jQuery)}(function ($) {
$(document).ready(function () {

var Selectors = {
	'Friends': '[data-pnref="friends"] li._698'
};
Object.defineProperty(Selectors, 'Posts', {enumerable: true, configurable: false, get: function () {if (typeof _posts === 'undefined') {_posts = (document.getElementsByClassName('userContentWrapper').length > 0 ? ".userContentWrapper" : document.getElementsByClassName('fbUserContent').length > 0 ? ".fbUserContent" : document.getElementsByClassName('fbUserPost').length > 0 ? ".fbUserPost" : document.getElementsByClassName('fbUserStory').length > 0 ? ".fbUserStory" : void 0);}return _posts;}});

var Filters = {
	"Days-0.25": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*0.25);},
	"Days-0.5": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*0.5);},
	"Days-0.75": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*0.75);},
	"Days-1": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24);},
	"Days-1.5": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*1.5);},
	"Days-2": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*2);},
	"Days-3": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*3);},
	"Days-5": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*5);},
	"Days-7": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*7);},
	"Days-10": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*10);},
	"Days-14": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*14);},
	"Days-21": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*21);},
	"Days-30": function () {return (parseInt($(this).find('abbr').attr('data-utime')) * 1000) > (Date.now() - 1000*60*60*24*30);},

	"BingoBlitz": function (i, e) {if ($(e).find('[data-appname="BINGO Blitz"]').length < 1) {return false;}return true;},
	"Caesars": function (i, e) {if ($(e).find('[data-appname="Caesars Slots"]').length < 1) {return false;}	return true;},
	"HouseOfFun": function (i, e) {if ($(e).find('[data-appname="House of Fun - Slots"]').length < 1) {return false;}return true;},
	"Slotomania": function (i, e) {if ($(e).find('[data-appname="Slotomania Slot Machines"]').length < 1) {return false;}return true;},
	"WSOP": function (i, e) {if ($(e).find('[data-appname="WSOP – Texas Holdem Poker"]').length < 1) {return false;}return true;}
};


var Facebook = {
	Filters: Filters,
	Selectors: Selectors,
	
	PostConverter: PostConverter
};

Object.defineProperties(Facebook, {
	'Friends': {enumerable: false, configurable: false, value: function () {return $(Selectors.Friends);}},
	'LastRunTime': {enumerable: true, configurable: false, 
		get: function () {if (typeof _lastRunTime !== 'undefined') {return _lastRunTime} return 0},
		set: function (t) {_lastRunTime = t}
	},
	'Posts': {enumerable: false, configurable: false, value: function () {
		var posts = $(Selectors.Posts);
		for (var i=0; i<arguments.length; i++) {
			posts = $(posts).filter(Filters[arguments[i]]);
		}
		
		posts.Convert = function () {
			var cPosts = [];
			for (var i=0; i<posts.length; i++) {cPosts.push(PostConverter(posts[i]));}
			return cPosts;
		};

		return posts;
	}},
	'Save' : {enumerable: false, configurable: false, value: function () {
		var pages = JSON.parse(localStorage['FacebookPages']);
		pages[$.Facebook.UserId] = {
			'LastRunTime': ($.Facebook.LastRunTime) ? $.Facebook.LastRunTime : "",
			'UserName': $.Facebook.UserName
		};
		localStorage['FacebookPages'] = JSON.stringify(pages);
		chrome.storage.sync.set({'FacebookPages': localStorage['FacebookPages']});
	}},
	'UserId': {enumerable: true, configurable: false, get: function () {
		if ($('meta[property=al\\:android\\:url]').length > 0) {return $('meta[property=al\\:android\\:url]').attr('content').split('/').pop();}
		if ($('meta[property=al\\:ios\\:url]').length > 0) {return $('meta[property=al\\:ios\\:url]').attr('content').split('/').pop();}
		if ($('#pagelet_timeline_main_column[data-gt]').length > 0) {	return JSON.parse($('#pagelet_timeline_main_column').attr('data-gt'))['profile_owner'];}
		return null;
	}},
	'Username': {enumerable: true, configurable: false, get: function () {
		if ($('script[type=application\\/ld\\+json]').length > 0) {return JSON.parse($('script[type=application\\/ld\\+json]').text())['name'];}
		if ($('.nameButton').length > 0) {return $('.nameButton').text();}
	}}
});



$.extend({"Facebook": Facebook});

if (localStorage['FacebookPages']) {
	var pages = JSON.parse(localStorage['FacebookPages']);
	if (($.Facebook.UserId) && ($.Facebook.UserId in pages)) {
		$.Facebook.LastRunTime = pages[$.Facebook.UserId].LastRunTime;
	}
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
	if ('FacebookPages' in changes) {
		localStorage['FacebookPages'] = changes['FacebookPages'].newValue;
		var pages = JSON.parse(changes['FacebookPages']);
		if (($.Facebook.UserId) && ($.Facebook.UserId in pages)) {
			$.Facebook.LastRunTime = pages[$.Facebook.UserId].LastRunTime;
		}
	}
});


});		//$(document).ready()


function GetParameterByName (name, url) {
	if (!url) {url = global.location.href;}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results) {return null;}
	if (!results[2]) { return '';}
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function RemoveURLParameter(url, parameter) {var urlparts= url.split('?'); if (urlparts.length>=2) {var prefix= encodeURIComponent(parameter)+'=';var pars= urlparts[1].split(/[&;]/g); for (var i= pars.length; i-- > 0;) {	if (pars[i].lastIndexOf(prefix, 0) !== -1) {pars.splice(i, 1);} }	url= urlparts[0]+'?'+pars.join('&');	return url; } else {	return url;}	}
function TrimLink(e) {return void 0 !== e && null !== e ? (link = e, link = RemoveURLParameter(link, "action_type_map"), link = RemoveURLParameter(link, "fb_ref"), link = RemoveURLParameter(link, "h"), link = RemoveURLParameter(link, "enc"), link = RemoveURLParameter(link, "s"), link = RemoveURLParameter(link, "fb_source"), link) : null}

function PostConverter (post) {
	var o = {
		Id: $.Facebook.UserId,
		Username: $.Facebook.Username,

		App: (($(post).find('[data-appname]').length < 1) ? "" : $(post).find('[data-appname]').attr('data-appname')),
		Image: (($(post).find('.fbStoryAttachmentImage img').length < 1) ? "" : GetParameterByName('url', decodeURIComponent($(post).find('.fbStoryAttachmentImage img').attr('src')))),
		Label: "",
		Timestamp: (($(post).find('abbr[data-utime]')) ? (parseInt($(post).find('abbr').attr('data-utime')) * 1000) : 0).toString(), 
		Url: ""
	};
	
	var label = '';
	if ($(post).find('.mbs').length > 0) {
		label = $(post).find('.mbs a')[0].innerText;
	} else {
		label = $(post).find('a')[0].innerText;
	}
	if (label === "r.houseoffuns.com" || label === "House Of Fun" || label === "House of Fun") {label = "Collect Free Spins";}
	if (label === "link.gambinoslot.com" || label === "Gambino Slots" || label === "gambino slots") {label = "Collect Free G-Coins";}
	o['Label'] = label;

	if ($(post).find('.mbs').length > 0) {
		o.Url = TrimLink(decodeURIComponent($(post).find('.mbs a').attr('href').split("/l.php?u=").pop()));
	} else {
		o.Url = TrimLink(decodeURIComponent($(post).find('a').attr('href').split("/l.php?u=").pop()));
	}

	return o;
}

}));	//function (factory)
