/**
 * creater:pater
 */
(function () {

	/**
	 *
	 * @param config
	 * @param {{speed:int}} 滚动速度(默认  '50' ) setInterval的间隔时间
	 * @param {{scroll_JqueryDom:String}} 需要滚动的标签  默认".horizontalScroll";
	 * @constructor
	 */
	function HorizontalScroll(config) {
		this.speed = config.speed ? config.speed : 50;
		this.scroll_JqueryDom = config.scroll_JqueryDom ? config.scroll_JqueryDom : ".horizontalScroll";
		this.init();
	}

	HorizontalScroll.prototype = {
		constructor: HorizontalScroll,
		init: function () {
			let _this = this;
			$(_this.scroll_JqueryDom).each(function(){
				let thisJquery = this;
				let gundong = $(thisJquery)[0];
				let step = 1;
				let scrollWidth= gundong.scrollWidth - gundong.offsetWidth - 1 ;
				/*只有大于0 才是需要滚动的*/
				if(scrollWidth > 0 ){
					let text = $(thisJquery).html();
					$(thisJquery).html("&nbsp&nbsp"+text);
					let textWidth = gundong.scrollWidth;
					$(thisJquery).html("&nbsp&nbsp"+text+"&nbsp&nbsp"+text);
					let scrollWidthNew = gundong.scrollWidth - gundong.offsetWidth - 1 ;
					let timer=setInterval(function () {
						gundong.scrollLeft += step;
						if(gundong.scrollLeft > textWidth){
							gundong.scrollLeft = gundong.scrollLeft-textWidth;
						}
					}, _this.speed)
				}
			});

		}
	};
	if (typeof exports == "object") {
		module.exports = HorizontalScroll;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return HorizontalScroll;
		})
	} else {
		window.HorizontalScroll = HorizontalScroll;
	}
})();
