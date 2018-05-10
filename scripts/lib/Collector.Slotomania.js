var liveUrl = 'https://script.google.com/macros/s/AKfycbySpNGba9m35Yz9GzqJ_TnnnsAOGRR3CYeTIto291uwqJinCp_J/exec';
var devUrl = 'https://script.google.com/macros/s/AKfycbyQS_TH-D5GGxSkUz00n2tvi2CMyB78t31T7dfNmzV4/dev';
var apiUrl = devUrl;

var SidiusFacebookId = '100022121436339';

var collector;

$(document).ready(function () {
	$('.App.TabLayout').tabs();
	collector = new Collector($('#Collector-Slotomania'));
	collector.GetLinks('Slotomania Slot Machines', SidiusFacebookId);
});



function Collector (e) {
	this.form = e;

	this.workerFrames = $(this.form).find('iframe');


	return this;
}

Collector.prototype.Urls = function (urls) {
	var e = $(this.form).find('.Collector-Urls');
	if (typeof urls === 'undefined') {
		return $(e).val().split("\n");
	} else {
		$(e).val(urls.join("\n"));
	}
	return this;
}

Collector.prototype.GetLinks = function (app, id) {
	var cx = this;
	var q = {'App': app, 'Id': id};
	console.log(GenerateQueryString(q));
	var xhr = new XMLHttpRequest();
	xhr.open("GET", apiUrl+'/posts?'+GenerateQueryString(q), true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var data = JSON.parse(xhr.responseText);
			var urls = [];
			data.forEach(function (e, i) {
				urls.push(e.Url);
				//$(cx).find('.Collector-Urls').val($(cx).find('.Collector-Urls').val()+"\n"+e.Url);
			});
			cx.Urls(urls);
		}
	}
	xhr.send();
};

function GenerateQueryString (q) {
	var qs = '';
	Object.keys(q).forEach(function (e, i) {
		if (qs == '') {
			qs = e+"="+encodeURIComponent(q[e]);
		} else {
			qs = qs+"&"+e+"="+encodeURIComponent(q[e]);
		}
	});
	return qs;
}

