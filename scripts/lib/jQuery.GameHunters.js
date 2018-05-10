(function (factory) {factory(jQuery)}(function ($) {

var GameHunters = {
	'Filters': {
		'BINGO Blitz': function (e) {if($(e).find('.bonus-description span').text().indexOf('help!') != -1) { return true; }},
		'Caesars Slots': function (e) {return false;},
		'House Of Fun - Slots': function (e) {return false;},
		'Slotomania Slot Machines': function (e) {return false;},
		'Vegas Downtown Slots & Words': function (e) {return false;},
		'WSOP - Texas Holdem Poker': function (e) {return false;}
	},
	'Urls': {
		'BINGO Blitz': 'https://gamehunters.club/bingo-blitz/bonus-links',
		'Caesars Slots': 'https://gamehunters.club/caesars-casino/share-links',
		'House Of Fun - Slots': 'https://gamehunters.club/house-of-fun-slots/share-links',
		'Slotomania Slot Machines': 'https://gamehunters.club/slotomania-fansite/share-links',
		'Vegas Downtown Slots & Words': 'https://gamehunters.club/vegas-downtown-slots/share-links',
		'WSOP - Texas Holdem Poker': 'https://gamehunters.club/wsop-texas-holdem-poker/share-links'
	}
};


function GetLinks (game, page, cb) {
	if (typeof page === 'undefined') {page = 1;}
	data = {ps: page, f:1}
	console.log(page);
	var fetch = $.post(GameHunters.Urls[game]+'/loader/?cache='+Date.now(), {ps: page, f:1}, function (response) {
		response = $.parseJSON(response);
		ProcessLinks(game, response, cb);
		if(response.has_next_page === true){
			GetLinks(game, response.next_page, cb);
		}
	});
}

function ProcessLinks (game, response, cb) {
	var links = {FanPage: [], User: []};
	var d = document.createElement('div');
	$(d).html(response.bonus_links);
	$(d).find("img[data-original='/img/gift-icon.jpg']").parent(".bonus-description").parent(".bonus-item").parent("a[rel='nofollow']").each(function (i, e) {
		if(!links.FanPage.includes($(e).attr("href"))) {
			links.FanPage.push($(e).attr("href"));
		}
	});

	$(d).find('i.fa').parent("span").each(function (i, e) {if (['1','2','3','4'].includes($(e).text().trim())) {
		if(!links.User.includes($(e).parentsUntil("figure", "a[rel='nofollow']").attr("href"))) {
			if (!GameHunters.Filters[game]($(e).parentsUntil("figure").parent("figure"))) {
				links.User.push($(e).parentsUntil("figure", "a[rel='nofollow']").attr("href"));
			}	
		}
	}});
	cb(game, links);
}


GameHunters.GetLinks = GetLinks;


$.extend({"GameHunters": GameHunters});


}));	//function (factory)
