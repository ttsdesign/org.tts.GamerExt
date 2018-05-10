;(function(window, document, undefined)  {
	"use strict";
	window.XTRACTOR_DEFAULT_TIME_INTERVAL = 30000;

	function XTractor (game, url, filter) {
		this.Game = game;
		this.Filter = (typeof filter === 'function') ? filter : function () {return false;};

		this.Timer;
		this.Links = {"FanPage": [], 'User': []};
		
		Object.defineProperty(this, 'Url', {configurable: false, enumerable: true, 
			get: function () {return "https://www.gamehunters.club/"+url+"/loader/?cache="+Date.now();},
			set: function (u) {url=u; return this;}
		});

		return this;
	}

	XTractor.prototype.GetLinks = function (page) {
		if (typeof page === 'undefined') {page = 1;}
		if (page === 1) {this.Links={"FanPage": [], 'User': []};}
		var x = this;
		var fetch = $.post(x.Url, {ps: page, f:1}, function (response) {
			response = $.parseJSON(response);
			var d = document.createElement('div');
			$(d).html(response.bonus_links);
			$(d).find("img[data-original='/img/gift-icon.jpg']").parent(".bonus-description").parent(".bonus-item").parent("a[rel='nofollow']").each(function (i, e) {if(!x.Links.FanPage.includes($(e).attr("href"))) {x.Links.FanPage.push($(e).attr("href"));}});
			$(d).find('i.fa').parent("span").each(function (i, e) {if (['1','2','3','4'].includes($(e).text().trim())) {
				if(!x.Links.User.includes($(e).parentsUntil("figure", "a[rel='nofollow']").attr("href"))) {
					if (typeof x.Filter !== 'undefined') {
						if (!x.Filter($(e).parentsUntil("figure").parent("figure"))) {x.Links.User.push($(e).parentsUntil("figure", "a[rel='nofollow']").attr("href"));}
					} else {x.Links.User.push($(e).parentsUntil("figure", "a[rel='nofollow']").attr("href"));}	
				}
			}});
			if(response.has_next_page === true){x.GetLinks(response.next_page);}
			else {
				var event = $.Event('xtractor-data');
				event.Game = x.Game;
				event.Links = JSON.parse(JSON.stringify(x.Links));
				$(window).trigger(event);
			}
		}).fail(function (response) {
			var event = $.Event('xtractor-fail');
			event.Game = x.Game;
			event.Response = response;
			$(window).trigger(event);
			x.Stop();
		});
	};

	XTractor.prototype.Start = function (timeInterval) {
		var x = this;
		x.GetLinks();
		x.Timer = setInterval(function () {x.GetLinks();}, (typeof timeInterval !== 'undefined') ? timeInterval : window.XTRACTOR_DEFAULT_TIME_INTERVAL);
	};

	XTractor.prototype.Stop = function () {
		if (typeof this.Timer) {
			clearInterval(this.Timer);
		}
	};
	
	window.XTractor = XTractor;


} )(typeof window !== "undefined" ? window : this, document);

/*
$(window).on('xtractor-data', function (e) {console.log('xtractor-data', e);});
$(window).on('xtractor-fail', function (e) {console.log('xtractor-data', e);});

var XTractors = {
	'BingoBlitz': new XTractor("Bingo Blitz", 'bingo-blitz/bonus-links', 	function (e) {if($(e).find('.bonus-description span').text().indexOf('help!') != -1) { return true; }}),
	'Slotomania': new XTractor("Slotomania", 'slotomania-fansite/share-links')
};
XTractors.BingoBlitz.Start();XTractors.Slotomania.Start();	
	
	
*/