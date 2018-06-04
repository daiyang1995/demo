$(document).ready(function () {

	$('.inputText').bind("focus", function (event) {
		var thisJquery = this;
		$('html, body').animate({
			scrollTop: $(thisJquery).parent().offset().top - $(".header").outerHeight(true)
		}, 300);
	});

});
