chrome.storage.sync.get(['ApiUrl'], function (storage) {
	if (!('ApiUrl' in storage)) {chrome.storage.sync.set({'ApiUrl': "https://script.google.com/macros/s/AKfycbyQS_TH-D5GGxSkUz00n2tvi2CMyB78t31T7dfNmzV4/dev"});}
});

$(document).ready(function() {
	chrome.storage.sync.get(['FacebookThreads'], function (data) {
		$("#AppTabs").tabs();
		var threads = 10;
		if ('FacebookiThreads' in data) {threads = data['FacebookThreads'];}
		$('#FacebookTab').html(_.template($('#lodash__FacebookTabPanel').html())({xtractorCount: threads}));
		//$('#FacebookTab').html(_.template($('#lodash__FacebookTabPanel').html())({xtractorCount: 4}));
		$("#FacebookTabs").tabs();
		$('#FacebookTabs button.GetUrls').button({disabled: true});
		$('#FacebookTabs button.Execute').button(); //{disabled: true});
		$('#FacebookTabs button.Stop').button({disabled: true});
		$("#GameHuntersTabs").tabs();
		//$('#Collector-Slotomania-Nav').tabs().removeClass("ui-tabs-vertical").removeClass("ui-helper-clearfix");
		//$("#Collector-Slotomania-Nav li" ).addClass( "ui-corner-top" ).removeClass( "ui-corner-left" );

		$("#CollectorTabNav").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
		$("#CollectorTabNav li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );

		$('#FacebookTabs .Action').change(function (e) {
			if ($('#FacebookTabs .Action').val() == 'Facebook.XTract.Posts') {
				$('#FacebookTabs button.GetUrls').button("option", "disabled", true);
				$('#FacebookTabs button.Execute').button("option", "disabled", true);
				GetPages(function (pages) {
					$("#FacebookTabs .Urls").val(pages.join("\n"));
					$('#FacebookTabs button.GetUrls').button("option", "disabled", false);
					$('#FacebookTabs button.Execute').button("option", "disabled", false);
				});
			}	
			if ($('#FacebookTabs .Action').val() == 'Facebook.XTract.Summary') {
				$('#FacebookTabs button.GetUrls').button("option", "disabled", true);
				$('#FacebookTabs button.Execute').button("option", "disabled", false);

			}	
			if ($('#FacebookTabs .Action').val() == 'Facebook.XTract.Friends') {
				$('#FacebookTabs button.GetUrls').button("option", "disabled", true);
				$('#FacebookTabs button.Execute').button("option", "disabled", false);

			}
		});

		$('#FacebookTabs button.Execute').click(function (e) {
			$('#FacebookTabs button.GetUrls').button("option", "disabled", true);
			$('#FacebookTabs button.Execute').button("option", "disabled", true);
			$('#FacebookTabs button.Stop').button("option", "disabled", false);
			for (var i=0; i<$('#FacebookTabs .XTractorFrame').length; i++) {
				var url = FacebookUrl($('#FacebookTabs .Action').val());
				if (url != null) {
					$('#FacebookTabs .XTractorFrame')[i].src=url;
				}
			}
		});

		$('#FacebookTabs button.GetUrls').click(function (e) {
			$('#FacebookTabs button.GetUrls').button("option", "disabled", true);
			$('#FacebookTabs button.Execute').button("option", "disabled", true);
			$('#FacebookTabs button.Stop').button("option", "disabled", true);
			GetPages(function (pages) {
				$("#FacebookTabs .Urls").val(pages.join("\n"));
				$('#FacebookTabs button.GetUrls').button("option", "disabled", false);
				$('#FacebookTabs button.Execute').button("option", "disabled", false);
			});
		});

		$('#FacebookTabs button.Stop').click(function (e) {
			$('#FacebookTabs button.GetUrls').button("option", "disabled", false);
			$('#FacebookTabs button.Execute').button("option", "disabled", false);
			$('#FacebookTabs button.Stop').button("option", "disabled", true);
			for (var i=0; i<$('#FacebookTabs .XTractorFrame').length; i++) {
				var url = FacebookUrl($('#FacebookTabs .Action').val());
				if (url != null) {
					$('#FacebookTabs .XTractorFrame')[i].src="home.html";
				}
			}
		});

		GetPages(function (pages) {
			$("#FacebookTabs .Urls").val(pages.join("\n"));
			$('#FacebookTabs button.GetUrls').button("option", "disabled", false);
			$('#FacebookTabs button.Execute').button("option", "disabled", false);
		});

	});

	/*
	$('#FacebookTabs').onShow(function () {
		$('#FacebookTabs button.GetUrls').button("option", "disabled", true);
		$('#FacebookTabs button.Execute').button("option", "disabled", true);
		$('#FacebookTabs button.Stop').button("option", "disabled", true);
		GetPages(function (pages) {
			$("#FacebookTabs .Urls").val(pages.join("\n"));
			$('#FacebookTabs button.GetUrls').button("option", "disabled", false);
			$('#FacebookTabs button.Execute').button("option", "disabled", false);
		});
	});
	*/
	
});

function FacebookUrl (cmd) {
	var urls = $('#FacebookTabs .Urls').val().split("\n");
	var url = urls.shift();
	$('#FacebookTabs .Urls')[0].value = urls.join("\n");
	if (url == "") {
		$('#FacebookTabs button.GetUrls').button("option", "disabled", false);
		$('#FacebookTabs button.Execute').button("option", "disabled", false);
		$('#FacebookTabs button.Stop').button("option", "disabled", true);
		return null;
	}
	url += ((url.includes("?")) ? "&cmd=" : "?cmd=")+cmd;
	return url;
}

window.addEventListener("message", function (event) {
	if ((event.data.cmd == 'Facebook.XTract.Posts') || (event.data.cmd == 'Facebook.XTract.Summary')) {
		var url = FacebookUrl(event.data.cmd);
		if (url != null) {
			event.source.postMessage({url: url, cmd: 'Load'}, "*");
		}
	}
}, false);


function GetPages (cb) {
	chrome.storage.sync.get(['ApiUrl'], function (data) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", data['ApiUrl']+'/pages', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				cb(JSON.parse(xhr.responseText));
			}
		}
		xhr.send();
	});
}

