(function (factory) {factory(jQuery)}(function ($) {

	// Utility Functions
	function GetCleanUrl () {	var id = GetParameterByName('id', document.location.href);var url = document.location.href.split("?")[0];if (id != null) {url+="?id="+id}if (url.includes("/friends")) {url = url.split("/friends")[0]}	return url;}
	function GetParameterByName (name, url) {if (!url) {url = location.href;}name = name.replace(/[\[\]]/g, "\\$&");var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),results = regex.exec(url);if (!results) {return null;}if (!results[2]) { return '';}return decodeURIComponent(results[2].replace(/\+/g, " "));}
	function RemoveURLParameter(url, parameter) {var urlparts= url.split('?'); if (urlparts.length>=2) {var prefix= encodeURIComponent(parameter)+'=';var pars= urlparts[1].split(/[&;]/g); for (var i= pars.length; i-- > 0;) {	if (pars[i].lastIndexOf(prefix, 0) !== -1) {pars.splice(i, 1);} }	url= urlparts[0]+'?'+pars.join('&');	return url; } else {	return url;}	}
	function TrimLink(e) {return void 0 !== e && null !== e ? (link = e, link = RemoveURLParameter(link, "action_object_map"), link = RemoveURLParameter(link, "action_ref_map"), link = RemoveURLParameter(link, "action_type_map"), link = RemoveURLParameter(link, "fb_ref"), link = RemoveURLParameter(link, "h"), link = RemoveURLParameter(link, "enc"), link = RemoveURLParameter(link, "s"), link = RemoveURLParameter(link, "fb_source"), link) : null}

	// jQuery Facebook Object
	$.extend({"Facebook": {
		"Filters": {
			"BINGO Blitz": function (i, e) {if ($(e).find('[data-appname="BINGO Blitz"]').length < 1) {return false;}return true;},
			"Caesars Slots": function (i, e) {if ($(e).find('[data-appname="Caesars Slots"]').length < 1) {return false;}	return true;},
			"House of Fun - Slots": function (i, e) {if ($(e).find('[data-appname="House of Fun - Slots"]').length < 1) {return false;}return true;},
			"Slotomania Slot Machines": function (i, e) {if ($(e).find('[data-appname="Slotomania Slot Machines"]').length < 1) {return false;}return true;},
			"WSOP – Texas Holdem Poker": function (i, e) {if ($(e).find('[data-appname="WSOP – Texas Holdem Poker"]').length < 1) {return false;}return true;},
		},
		"Friends": function () {
			var ids = [];
			$($.Facebook.Selectors.Friends()).each(function(i, e) {
				ids.push($(e).find('[data-hovercard]').attr('data-hovercard').split('=')[1].split('&')[0])
			});
			return ids;
		},
		"PostConverter": function (post) {
			return {
				Id: $.Facebook.UserId,
				Username: $.Facebook.Username,
				App: (($(post).find('[data-appname]').length < 1) ? "" : $(post).find('[data-appname]').attr('data-appname')),
				Image: (($(post).find('.fbStoryAttachmentImage img').length < 1) ? "" : GetParameterByName('url', decodeURIComponent($(post).find('.fbStoryAttachmentImage img').attr('src')))),
				Label: ($(post).find('.mbs').length > 0) ? $(post).find('.mbs a')[0].innerText : $(post).find('a')[0].innerText,
				Timestamp: (($(post).find('abbr[data-utime]')) ? (parseInt($(post).find('abbr').attr('data-utime')) * 1000) : 0).toString(),
				Url: ($(post).find('.mbs').length > 0) ? TrimLink(decodeURIComponent($(post).find('.mbs a').attr('href').split("/l.php?u=").pop())) : TrimLink(decodeURIComponent($(post).find('a').attr('href').split("/l.php?u=").pop()))
			};
		},
		"Posts": function () {
			var posts = $($.Facebook.Selectors.Posts());
			for (var i=0; i<arguments.length; i++) {
				if (typeof arguments[i] === 'number') {
					if (arguments[i] == 0) {return true	}
					var date = arguments[i];
					posts = $(posts).filter(	function () {
						return ((parseInt($(this).find('abbr').attr('data-utime')) * 1000) > date)
					});
				}
				if (typeof arguments[i] === 'string' && (arguments[i] in $.Facebook.Filters)) {
					posts = $(posts).filter($.Facebook.Filters[arguments[i]]);
				}
			}
			posts.Convert = function () {
				var gamePosts = [];
				for (var i=0; i<this.length; i++) {
					gamePosts.push({
						Id: $.Facebook.UserId,
						Username: $.Facebook.Username,
						App: (($(this[i]).find('[data-appname]').length < 1) ? "" : $(this[i]).find('[data-appname]').attr('data-appname')),
						Image: (($(this[i]).find('.fbStoryAttachmentImage img').length < 1) ? "" : GetParameterByName('url', decodeURIComponent($(this[i]).find('.fbStoryAttachmentImage img').attr('src')))),
						Label: ($(this[i]).find('.mbs').length > 0) ? $(this[i]).find('.mbs a')[0].innerText : $(this[i]).find('a')[0].innerText,
						Timestamp: (($(this[i]).find('abbr[data-utime]')) ? (parseInt($(this[i]).find('abbr').attr('data-utime')) * 1000) : 0).toString(),
						Url: ($(this[i]).find('.mbs').length > 0) ? TrimLink(decodeURIComponent($(this[i]).find('.mbs a').attr('href').split("/l.php?u=").pop())) : TrimLink(decodeURIComponent($(this[i]).find('a').attr('href').split("/l.php?u=").pop()))
					});
				}
				return gamePosts;
			};
			return posts;
		},
		"Scroll": function () {
			var cb = function () {}, date = (Date.now() - 1000*60*60*24*3), count = -1, scrollCount = 0;
			if (arguments.length == 1) {cb=arguments[0]	}
			if (arguments.length > 1) {date=arguments[0];cb=arguments[1]}

			if (location.href.includes("/friends")) {
				function Scroller () {
					if ($("#medley_header_photos").length == 0) {
						window.scrollTo(0, document.body.scrollHeight);
						window.setTimeout(Scroller, 750);
					} else {
						cb();
					}
				};
				Scroller();				
			} else {
				var Scroller = function () {
					if (count < $.Facebook.Posts(date).length) {
						count = $.Facebook.Posts(date).length;
						window.scrollTo(0, document.body.scrollHeight);
						if (scrollCount < ((60/5)*10)) {
							window.setTimeout(Scroller, $.Facebook.ScrollTimeDelay);
							scrollCount++;
						}
					}else {
						cb()
					}
				};
				Scroller();
			}
		},
		"ScrollTimeDelay": 2250,
		"Selectors": {
			"Friends": function () {return "li._698"},
			"Posts": function () {return (document.getElementsByClassName('userContentWrapper').length > 0 ? ".userContentWrapper" : document.getElementsByClassName('fbUserContent').length > 0 ? ".fbUserContent" : document.getElementsByClassName('fbUserPost').length > 0 ? ".fbUserPost" : document.getElementsByClassName('fbUserStory').length > 0 ? ".fbUserStory" : void 0)}
		},
		"Url": GetCleanUrl(),
		"UserId": "",
		"Username": "",
		"XTract": {
			"Friends": function (cb) {
				$.Facebook.Scroll(function () {
					cb({Id:$.Facebook.UserId,Friends:$.Facebook.Friends()});
				});
			},
			"Posts": function (date, cb) {
				$.Facebook.Scroll(date, function () {
					var gamePosts = [];
					Object.keys($.Facebook.Filters).forEach(function (game) {
						gamePosts = gamePosts.concat($.Facebook.Posts(game, date).Convert());
					});
					cb({"Id": $.Facebook.UserId, "Url": $.Facebook.Url,"Date": Date.now(),"Posts": gamePosts});
				});
			},
			"Summary": function (date, cb) {
				$.Facebook.Scroll(date, function () {
					var data = {Id:$.Facebook.UserId,Url:$.Facebook.Url,"Total Posts":$.Facebook.Posts(date).length,"Game Posts":0};
					Object.keys($.Facebook.Filters).forEach(function (game) {data[game] = $.Facebook.Posts(game, date).length;data["Game Posts"] += data[game];});

					var gamePosts = [];
					Object.keys($.Facebook.Filters).forEach(function (game) {gamePosts = gamePosts.concat($.Facebook.Posts(game, Date.now()-1000*60*60*24*3).Convert())});
					data['PostsData'] = {"Id": $.Facebook.UserId, "Url": $.Facebook.Url,"Date": Date.now(),"Posts": gamePosts};

					cb(data);
				});
			}
		}
	}});

	$(document).ready(function () {
		// Set Post Container Selector
		//console.log("Setting Facebook.Selectors.Posts");
		//$.Facebook.Selectors.Posts = (document.getElementsByClassName('userContentWrapper').length > 0 ? ".userContentWrapper" : document.getElementsByClassName('fbUserContent').length > 0 ? ".fbUserContent" : document.getElementsByClassName('fbUserPost').length > 0 ? ".fbUserPost" : document.getElementsByClassName('fbUserStory').length > 0 ? ".fbUserStory" : void 0);
		// Set UserId of Page
		if ($('meta[property=al\\:android\\:url]').length > 0) {$.Facebook.UserId = $('meta[property=al\\:android\\:url]').attr('content').split('/').pop()}
		else if ($('meta[property=al\\:ios\\:url]').length > 0) {$.Facebook.UserId = $('meta[property=al\\:ios\\:url]').attr('content').split('/').pop()}
		else if ($('#pagelet_timeline_main_column[data-gt]').length > 0) {	$.Facebook.UserId = JSON.parse($('#pagelet_timeline_main_column').attr('data-gt'))['profile_owner']}
		// Set Username of Page
		if ($('script[type=application\\/ld\\+json]').length > 0) {$.Facebook.Username = JSON.parse($('script[type=application\\/ld\\+json]').text())['name'];}
		else if ($('.nameButton').length > 0) {$.Facebook.Username = $('.nameButton').text();}
	});	//$(document).ready()

}));//function (factory)







/*

"Filters": {
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
			"Days-Custom": function () {var date = ((GetParameterByName('date', document.location.href) == null) ? (Date.now() - 1000*60*60*24*3) : parseInt(GetParameterByName('date', document.location.href)));return ((parseInt($(this).find('abbr').attr('data-utime')) * 1000) > date)},
			"CustomDate": Date.now() - 1000*60*60*24*10,

			"BINGO Blitz": function (i, e) {if ($(e).find('[data-appname="BINGO Blitz"]').length < 1) {return false;}return true;},
			"Caesars Slots": function (i, e) {if ($(e).find('[data-appname="Caesars Slots"]').length < 1) {return false;}	return true;},
			"House of Fun - Slots": function (i, e) {if ($(e).find('[data-appname="House of Fun - Slots"]').length < 1) {return false;}return true;},
			"Slotomania Slot Machines": function (i, e) {if ($(e).find('[data-appname="Slotomania Slot Machines"]').length < 1) {return false;}return true;},
			"WSOP – Texas Holdem Poker": function (i, e) {if ($(e).find('[data-appname="WSOP – Texas Holdem Poker"]').length < 1) {return false;}return true;},

			"BingoBlitz": function (i, e) {if ($(e).find('[data-appname="BINGO Blitz"]').length < 1) {return false;}return true;},
			"Caesars": function (i, e) {if ($(e).find('[data-appname="Caesars Slots"]').length < 1) {return false;}	return true;},
			"HouseOfFun": function (i, e) {if ($(e).find('[data-appname="House of Fun - Slots"]').length < 1) {return false;}return true;},
			"Slotomania": function (i, e) {if ($(e).find('[data-appname="Slotomania Slot Machines"]').length < 1) {return false;}return true;},
			"WSOP": function (i, e) {if ($(e).find('[data-appname="WSOP – Texas Holdem Poker"]').length < 1) {return false;}return true;}
		},

//Object.defineProperty(Selectors, 'Posts', {enumerable: true, configurable: false, get: function () {if (typeof _posts === 'undefined') {_posts = (document.getElementsByClassName('userContentWrapper').length > 0 ? ".userContentWrapper" : document.getElementsByClassName('fbUserContent').length > 0 ? ".fbUserContent" : document.getElementsByClassName('fbUserPost').length > 0 ? ".fbUserPost" : document.getElementsByClassName('fbUserStory').length > 0 ? ".fbUserStory" : void 0);}return _posts;}});


Object.defineProperties(Facebook, {
	'Friends': {enumerable: false, configurable: false, value: function () {
		var ids = [];
		$(Selectors.Friends).each(function(i, e) {ids.push($(e).find('[data-hovercard]').attr('data-hovercard').split('=')[1].split('&')[0])});
		return ids;
	}},
	'Posts': {enumerable: false, configurable: false, value: function () {
		// Get Posts
		var posts = $(Selectors.Posts);

		// Apply Filters
		for (var i=0; i<arguments.length; i++) {
			if (typeof arguments[i] === 'number') {
				var date = arguments[i];
				posts = $(posts).filter(	function () {
					return ((parseInt($(this).find('abbr').attr('data-utime')) * 1000) > date)
				});
			}
			if (typeof arguments[i] === 'string' && (arguments[i] in Filters)) {
				posts = $(posts).filter(Filters[arguments[i]]);
			}
		}
		
		// Attach Object Converter
		posts.Convert = function () {
			for (var i=0; i<posts.length; i++) {
				posts[i] = {
					Id: $.Facebook.UserId,
					Username: $.Facebook.Username,
					App: (($(posts[i]).find('[data-appname]').length < 1) ? "" : $(posts[i]).find('[data-appname]').attr('data-appname')),
					Image: (($(posts[i]).find('.fbStoryAttachmentImage img').length < 1) ? "" : GetParameterByName('url', decodeURIComponent($(posts[i]).find('.fbStoryAttachmentImage img').attr('src')))),
					Label: ($(posts[i]).find('.mbs').length > 0) ? $(posts[i]).find('.mbs a')[0].innerText : $(posts[i]).find('a')[0].innerText,
					Timestamp: (($(posts[i]).find('abbr[data-utime]')) ? (parseInt($(posts[i]).find('abbr').attr('data-utime')) * 1000) : 0).toString(),
					Url: ($(posts[i]).find('.mbs').length > 0) ? TrimLink(decodeURIComponent($(posts[i]).find('.mbs a').attr('href').split("/l.php?u=").pop())) : TrimLink(decodeURIComponent($(posts[i]).find('a').attr('href').split("/l.php?u=").pop()))
				}
			}
			return posts;
		};

		return posts;
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

	
	function PostConverter (post) {
		return {
			Id: $.Facebook.UserId,
			Username: $.Facebook.Username,
			App: (($(post).find('[data-appname]').length < 1) ? "" : $(post).find('[data-appname]').attr('data-appname')),
			Image: (($(post).find('.fbStoryAttachmentImage img').length < 1) ? "" : GetParameterByName('url', decodeURIComponent($(post).find('.fbStoryAttachmentImage img').attr('src')))),
			Label: ($(post).find('.mbs').length > 0) ? $(post).find('.mbs a')[0].innerText : $(post).find('a')[0].innerText,
			Timestamp: (($(post).find('abbr[data-utime]')) ? (parseInt($(post).find('abbr').attr('data-utime')) * 1000) : 0).toString(), 
			Url: ($(post).find('.mbs').length > 0) ? TrimLink(decodeURIComponent($(post).find('.mbs a').attr('href').split("/l.php?u=").pop())) : TrimLink(decodeURIComponent($(post).find('a').attr('href').split("/l.php?u=").pop()))
		};
	}

*/

