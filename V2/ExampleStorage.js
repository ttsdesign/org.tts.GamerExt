
Apps = {
	"Facebook": {
		"Enabled": true,
		"UrlPattern": "*://apps.facebook.com/*",
		"Selectors": [
			"document.getElementById('pagelet_bluebar')",
			"document.getElementById('rightCol')",
			"document.getElementById('pagelet_dock')"
		]
	},
	"Slotomania": {
		"Enabled": true,
		"UrlMatchPattern": "*://vs-fb-php-va2.playtika.com/playtika/vs_fb_en/*",
		"Selectors": [
			"document.getElementById('header')",
			"document.getElementById('footer')"
		]
	}
};





function UpdateObjects (selectors, display) {
	display = (typeof show !== "undefined" && (show === true || show === "initial")) ? "initial" : "none";
	selectors.forEach(function (selector) {
		var o = Function("return "+selector)();
		if (o) {
			if ("length" in o) {
				for (var i=0; i<o.length; i++) {
					o[i].style.display = display
				}
			} else {
				o.style.display = display;
			}
		}
	});
}


Object.keys(LayoutFunctions.Slotomania.Modifiers).forEach(function (f) {
	LayoutFunctions.Slotomania.Modifiers[f]()
});




