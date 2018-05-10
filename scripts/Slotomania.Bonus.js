
$(document).ready(function() {
	if ($('.couponCollectView').length > 0) {
		var result = CollectionResult();
		console.log(JSON.stringify(result));

		localStorage['SlotoRewards']

	}
});


function CollectionResult () {
	if ($(".couponCollectView.successCouponCollect").length > 0) {
		return {
			status: 'success',
			coins: Number($(".couponCollectView .resultSuccess .resultItem b")[0].innerText.replace(',','')),
			multiplier: Number($(".couponCollectView .resultSuccess .resultItem b")[1].innerText.replace(',','')),
			total: Number($(".couponCollectView .resultSuccess .resultItem b")[2].innerText.replace(',',''))
		};
	}
	if ($(".couponCollectView.failedCouponCollect").length > 0) {
		return {
			status: 'fail',
			message: $(".couponCollectView .resultText").text()
		};
	}
	return null;
}

