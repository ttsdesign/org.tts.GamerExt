var removedLayoutItems;
$(document).ready(function () {
		ModifyLayouts();
});

function ModifyLayouts () {
	removedLayoutItems = {
		'FacebookApps': {},
		'BingoBlitz': {},
		'HouseOfFun': {},
		'HuuugeCasino': {},
		'Slotomania': {},
		'VegasDownntownSlots': {},
		'WSOP': {}
	};

	if (location.href.match(ParseMatchPattern("*://apps.facebook.com/*")) != null) {
		if ($('#pagelet_bluebar').length > 0) {
			removedLayoutItems['FacebookApps']['#pagelet_bluebar'] = {parent: $('#pagelet_bluebar').parent, element: $('#pagelet_bluebar')};
			$('#pagelet_bluebar').remove();
		}
		if ($('#rightCol').length > 0) {
			removedLayoutItems['FacebookApps']['#rightCol'] = {parent: $('#rightCol').parent, element: $('#rightCol')};
			$('#rightCol').remove();
		}
		if ($('#pagelet_dock').length > 0) {
			removedLayoutItems['FacebookApps']['#pagelet_dock'] = {parent: $('#pagelet_dock').parent, element: $('#pagelet_dock')};
			$('#pagelet_dock').remove();
		}
	}

	if ((location.href.match(ParseMatchPattern("*://gnocchi-www.buffalo-ggn.net/bingo2-v2-bingoblitz/*")) != null) || (location.href.match(ParseMatchPattern("*://apps.facebook.com/bingoblitz/*")) != null)) {
		if ($('#footer').length > 0) {
			removedLayoutItems['BingoBlitz']['#footer'] = {parent: $('#footer').parent, element: $('#footer')};
			$('#footer').remove();
		}
		if ($('#iframe_canvas').length > 0) {
			$('#iframe_canvas').css({height: '100%'});
		}
	}

	if (location.href.match(ParseMatchPattern("*://cc-fb-php-p1.playtika.com/playtika/cc_fb_en/*")) != null) {

	}

	if (location.href.match(ParseMatchPattern("*://fb-lb.houseoffuns.com/facebook/*")) != null) {
		if ($('.pluginLike').length > 0) {
			removedLayoutItems['HouseOfFun']['.pluginLike'] = {parent: $('.pluginLike').parent, element: $('.pluginLike')};
			$('.pluginLike').remove();
		}
		if ($('#footer').length > 0) {
			removedLayoutItems['HouseOfFun']['#footer'] = {parent: $('#footer').parent, element: $('#footer')};
			$('#footer').remove();
		}
		if ($('.pluginLikebox').length > 0) {
			removedLayoutItems['HouseOfFun']['.pluginLikebox'] = {parent: $('.pluginLikebox').parent, element: $('.pluginLikebox')};
			$('.pluginLikebox').remove();
		}
	}


	if (location.href.match(ParseMatchPattern("*://cdn-hc-production-fb.akamaized.net/emscripten/*")) != null) {
		if ($('#huuuge-top').length > 0) {
			removedLayoutItems['HuuugeCasino']['#huuuge-top'] = {parent: $('#huuuge-top').parent, element: $('#huuuge-top')};
			$('#huuuge-top').remove();
		}
		if ($('.huuuge-bottom').length > 0) {
			removedLayoutItems['HuuugeCasino']['.huuuge-bottom'] = {parent: $('.huuuge-bottom').parent, element: $('.huuuge-bottom')};
			$('.huuuge-bottom').remove();
		}
		if ($('.likebox').length > 0) {
			removedLayoutItems['HuuugeCasino']['.likebox'] = {parent: $('.likebox').parent, element: $('.likebox')};
			$('.likebox').remove();
		}
	}

	if (location.href.match(ParseMatchPattern("*://vs-fb-php-va2.playtika.com/playtika/vs_fb_en/*")) != null) {
		if ($('#header').length > 0) {
			removedLayoutItems['Slotomania']['#header'] = {parent: $('#header').parent, element: $('#header')};
			$('#header').remove();
		}
		if ($('#footer').length > 0) {
			removedLayoutItems['Slotomania']['#footer'] = {parent: $('#footer').parent, element: $('#footer')};
			$('#footer').remove();
		}
	}

	if (location.href.match(ParseMatchPattern("*://vegas-php.playtika.com/playtika/vds_fb_en/*")) != null) {
		if ($('.top_panel_bg').length > 0) {
			removedLayoutItems['VegasDownntownSlots']['.top_panel_bg'] = {parent: $('.top_panel_bg').parent, element: $('.top_panel_bg')};
			$('.top_panel_bg').remove();
		}
		if ($('.bottom_panel_con').length > 0) {
			removedLayoutItems['VegasDownntownSlots']['.bottom_panel_con'] = {parent: $('.bottom_panel_con').parent, element: $('.bottom_panel_con')};
			$('.bottom_panel_con').remove();
		}
	}

	if (location.href.match(ParseMatchPattern("*://facebook-proxy-prod.wsop.playtika.com/*")) != null) {
		if ($('.headContainer').length > 0) {
			removedLayoutItems['WSOP']['.headContainer'] = {parent: $('.headContainer').parent, element: $('.headContainer')};
			$('.headContainer').remove();
		}
		if ($('#mainFooter').length > 0) {
			removedLayoutItems['WSOP']['#mainFooter'] = {parent: $('#mainFooter').parent, element: $('#mainFooter')};
			$('#mainFooter').remove();
		}
	}
}

function RestoreLayout () {
	if (typeof removedLayoutItems === 'undefined') {
		return false;
	}
	//...TBD...
	return true;
}

function ParseMatchPattern (input) {
	if (typeof input !== 'string') return null;
	var match_pattern = '(?:^'
		, regEscape = function (s) {
		return s.replace(/[[^$.|?*+(){}\\]/g, '\\$&');
	}
		, result = /^(\*|https?|file|ftp|chrome-extension):\/\//.exec(input);

	if (!result) return null;
	input = input.substr(result[0].length);
	match_pattern += result[1] === '*' ? 'https?://' : result[1] + '://';

	if (result[1] !== 'file') {
		if (!(result = /^(?:\*|(\*\.)?([^\/*]+))(?=\/)/.exec(input))) return null;
		input = input.substr(result[0].length);
		if (result[0] === '*') { 
			match_pattern += '[^/]+';
		} else {
			if (result[1]) { 
				match_pattern += '(?:[^/]+\\.)?';
			}
			
			match_pattern += regEscape(result[2]);
		}
	}
	match_pattern += input.split('*').map(regEscape).join('.*');
	match_pattern += '$)';
	return match_pattern;
}
