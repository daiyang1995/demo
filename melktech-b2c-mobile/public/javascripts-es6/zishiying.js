$(document).ready(function () {

    $('.inputText').bind("focus", function (event) {
        var thisJquery = this;
        $('html, body').animate({
            scrollTop: $(thisJquery).parent().offset().top - $(".header").outerHeight(true)
        }, 300);
    });
    // $("body").on("vclick", '#screen, #screen #screenLoading', function () {
    //     $("#screen").animate({left: "-100%"}, 100);
    //     setTimeout(function () {
    //         $("#screen").remove();
    //     }, 100)
	//
    // });

});
