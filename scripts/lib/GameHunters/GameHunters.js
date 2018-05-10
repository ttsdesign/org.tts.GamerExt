
/* XTractors.js */
!function(t,e,n){"use strict";function i(t,e,n){return this.Game=t,this.Filter="function"==typeof n?n:function(){return!1},this.Timer,this.Links={FanPage:[],User:[]},Object.defineProperty(this,"Url",{configurable:!1,enumerable:!0,get:function(){return e+"/loader/?cache="+Date.now()},set:function(t){return e=t,this}}),this}t.XTRACTOR_DEFAULT_TIME_INTERVAL=3e4,i.prototype.GetLinks=function(n){void 0===n&&(n=1),1===n&&(this.Links={FanPage:[],User:[]});var i=this;$.post(i.Url,{ps:n,f:1},function(n){n=$.parseJSON(n);var r=e.createElement("div");if($(r).html(n.bonus_links),$(r).find("img[data-original='/img/gift-icon.jpg']").parent(".bonus-description").parent(".bonus-item").parent("a[rel='nofollow']").each(function(t,e){i.Links.FanPage.includes($(e).attr("href"))||i.Links.FanPage.push($(e).attr("href"))}),$(r).find("i.fa").parent("span").each(function(t,e){["1","2","3","4"].includes($(e).text().trim())&&(i.Links.User.includes($(e).parentsUntil("figure","a[rel='nofollow']").attr("href"))||void 0!==i.Filter&&i.Filter($(e).parentsUntil("figure").parent("figure"))||i.Links.User.push($(e).parentsUntil("figure","a[rel='nofollow']").attr("href")))}),!0===n.has_next_page)i.GetLinks(n.next_page);else{var a=$.Event("xtractor-data");a.Game=i.Game,a.Links=JSON.parse(JSON.stringify(i.Links)),$(t).trigger(a)}}).fail(function(e){var n=$.Event("xtractor-fail");n.Game=i.Game,n.Response=e,$(t).trigger(n),i.Stop()})},i.prototype.Start=function(e){var n=this;n.GetLinks(),n.Timer=setInterval(function(){n.GetLinks()},void 0!==e?e:t.XTRACTOR_DEFAULT_TIME_INTERVAL)},i.prototype.Stop=function(){this.Timer,clearInterval(this.Timer)},t.XTractor=i}("undefined"!=typeof window?window:this,document);
/* Collectors.js */
!function(e,n,u){"use strict";e.COLLECTOR_DEFAULT_TIME_INTERVAL=35e3,e.Collector=function(n,u){var i,t={Queue:{FanPage:[],User:[]},Log:{FanPage:[],User:[]},All:[]},o=setInterval(function(){var n="";t.Queue.User.length>0?(n=t.Queue.User.shift(),t.Log.User.push(n)):t.Queue.FanPage.length>0&&(n=t.Queue.FanPage.shift(),t.Log.FanPage.push(n)),""!=n&&(void 0===i||0==i.length?i=e.open(n,"_blank"):i.location.href=n)},void 0!==u?u:e.COLLECTOR_DEFAULT_TIME_INTERVAL);return $(e).on("xtractor-data",function(e){e.Game==n&&(e.Links.FanPage.forEach(function(e,n){t.All.indexOf(e)<0&&(t.Queue.FanPage.push(e),t.All.push(e))}),e.Links.User.forEach(function(e,n){t.All.indexOf(e)<0&&(t.Queue.User.push(e),t.All.push(e))}),console.log(JSON.stringify(t,null,4)))}),this.Links=t,this.Window=i,this.Timer=o,this}}("undefined"!=typeof window?window:this,document);

;(function(window, document, undefined) {
	"use strict";

	function GameHunters (_XTractors) {
		if (typeof _XTractors === 'undefined') {_XTractors = {};}
		Object.defineProperties(_XTractors, {
			'Start': {configurable: false, enumerable: true, value: function (timeInterval) {
				Object.keys(_XTractors).forEach(function (v, i) {if (_XTractors[v].Start) {_XTractors[v].Start(timeInterval);}}, _XTractors);
			}},
			'Stop': {configurable: false, enumerable: true, value: function (timeInterval) {
				Object.keys(_XTractors).forEach(function (v, i) {if (_XTractors[v].Stop) {_XTractors[v].Stop();}}, _XTractors);
			}}
		});

		
		Object.defineProperties(this, {
			'XTractors': {configurable: false, enumerable: true, get: function () {return _XTractors;}, set: function () {return this;}}
		});

		this._Collectors = {};
		Object.keys(_XTractors).forEach(function (k, i) {
			if (_XTractors[k]) {
				this._Collectors[k] = new Collector(_XTractors[k].Game);
			}
		}, this);


		return this;
	}

	GameHunters.prototype.PostMessage = function (data) {
		if ((window.opener == null) || (typeof data === 'undefined')) {
			return false;
		}
		data['api'] = 'gaming.ttscloud.net';
		window.opener.postMessage(data, "*");
	};


	window.GameHunters = GameHunters;

} )(typeof window !== "undefined" ? window : this, document);


function StartGameHunters () {
	console.log('Starting GameHunters...');

	var XTracts = {
		'BingoBlitz': new XTractor("Bingo Blitz", 'bingo-blitz/bonus-links', function (data) {console.log(data);}, function (e) {if($(e).find('.bonus-description span').text().indexOf('help!') != -1) { return true; }}),
		'Slotomania': new XTractor("Slotomania", 'slotomania-fansite/share-links', function (data) {console.log(data);})
	};
	
	window.gameHunters = new GameHunters(XTracts);
	window.gameHunters.XTractors.Start();
	

}


jQuery(document).ready(function() {
	if (window.opener != null) {
		window.addEventListener("message",  function (event) {
			if ((event.data.api == 'gaming.ttscloud.net') && (event.data.cmd == 'ControlModeCheck') && (event.data.data.ControlMode)) {
				if ($('.guest-login-link').length > 0) {
					location.href="/facebook-auth/login";
				} else {
					if (location.href != "https://gamehunters.club/") {
						location.href="https://gamehunters.club/";
					} else {
						StartGameHunters();
					}
				}
			}
		}, {once: true});
		window.opener.postMessage({cmd: 'ControlModeCheck'}, "*");
	}
});

