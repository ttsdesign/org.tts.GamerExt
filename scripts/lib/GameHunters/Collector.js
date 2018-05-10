
;(function(window, document, undefined)  {
	"use strict";
	window.COLLECTOR_DEFAULT_TIME_INTERVAL = 35000;

	function Collector (game, timeInterval) {
		var _Links = {
			'Queue': {'FanPage': [],	'User': []},
			'Log': {'FanPage': [], 'User': []},
			'All': []
		};

		var _Window;
		var _Timer = setInterval(function () {
			var url = '';
			if (_Links.Queue.User.length > 0) {
				url = _Links.Queue.User.shift();
				_Links.Log.User.push(url);
			} else if (_Links.Queue.FanPage.length > 0) {
				url = _Links.Queue.FanPage.shift();
				_Links.Log.FanPage.push(url);
			}
			if (url != '') {
				if ((typeof _Window === 'undefined') || (_Window.length == 0)) {
					_Window = window.open(url, "_blank");
				} else {
					_Window.location.href=url;
				}
			}
		}, (typeof timeInterval !== 'undefined') ? timeInterval : window.COLLECTOR_DEFAULT_TIME_INTERVAL);

		$(window).on('xtractor-data', function (e) {
			if (e.Game == game) {
				e.Links.FanPage.forEach(function (l, i) {
					if (_Links.All.indexOf(l) < 0) {
						_Links.Queue.FanPage.push(l);
						_Links.All.push(l);
					}
				});
				e.Links.User.forEach(function (l, i) {
					if (_Links.All.indexOf(l) < 0) {
						_Links.Queue.User.push(l);
						_Links.All.push(l);
					}
				});
				console.log(JSON.stringify(_Links, null, 4));
			}
		});



		this.Links = _Links;
		this.Window = _Window;
		this.Timer = _Timer;
		return this;
	}
	
	window.Collector = Collector;

} )(typeof window !== "undefined" ? window : this, document);

/*
var Collectors = {
	'BingoBlitz': new Collector('Bingo Blitz'),
	'Slotomania': new Collector('Slotomania')
};
*/
