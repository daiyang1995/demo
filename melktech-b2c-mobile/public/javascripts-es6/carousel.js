/**
 * creater:pater
 */
(function () {

	/**
	 * demo :
	 *  <div id="carousel" class="carousel">
	 * 		<img src="1.png">
	 *		<img src="2.png">
	 *		<img src="3.png">
	 *		<img src="4.png">
	 *	</div>
	 */

	/**
	 * @param config
	 * @param {{trigger:String}} config 触发选择标识 默认 "#carousel"
	 * @param {{speed:int}} config 动画速度 默认400
	 * @param {{timeout:int}} config 自动轮播间隔 默认4000
	 * @param {{height:int}} config 整体高度 默认4 (单位rem)
	 * @param {{type:int}} config 轮播类型 默认1   1->正常轮播 2->中心点缩放轮播
	 * @param {{rate:float}} config 缩放比例 默认0.8 (只有type =2 时需要)
	 */
	function Carousel(config) {
		this.trigger = config.trigger ? config.trigger : "#carousel";
		this.speed = config.speed ? config.speed : 400;
		this.timeout = config.timeout ? config.timeout : 4000;
		this.height = config.height ? config.height : 4;
		this.type = config.type ? config.type : 1;
		this.rate  = config.rate ? config.rate : 0.8;
		this.count = 0;
		this.preIdx = 0;
		this.idx = 0;
		this.nextIdx = 1;
		this.doing = false;
		this.time = 0;
		this.minHeight;
		this.minWidth;
		this.minLeft;
		this.minTop;
		this.init();
	}

	Carousel.prototype = {
		constructor: Carousel,
		init: function () {
			let _this = this;
			if ($(_this.trigger).length == 0) {
				console.error('Carousel has been successfully installed, but no trigger found on your page.');
				return false;
			} else {
				_this.count = $(this.trigger + " img").length;
				_this.preIdx = _this.count - 1;
				if(2 == _this.type ){
					_this.minWidth = $(this.trigger).outerWidth(true) * _this.rate;
					_this.minLeft = ($(this.trigger).outerWidth(true) - _this.minWidth ) /2;
					_this.minHeight = _this.height * _this.rate;
					_this.minTop = ( _this.height - _this.minHeight ) /2;
				}
			}
			if (_this.nextIdx == _this.count) {
				console.error("图片只有一个，不需要轮播");
				return false;
			}
			_this.setHtml();
			_this.setCss();
			_this.setActive();
			$(_this.trigger + ` img:eq(${_this.idx})`).css("left", "0%");
			$(_this.trigger + ` img:eq(${_this.preIdx})`).css("left", "-100%");

			setInterval(function () {
				_this.time += _this.timeout/2;
				if (!_this.doing && _this.time >= _this.timeout ) {
					_this.doing = true;
					_this.time = 0;
					if(2 == _this.type){
						_this.swipeLeftFunction2();
					}else{
						_this.swipeLeftFunction();
					}
 				}
			}, _this.timeout/2 );

			$(_this.trigger).on("swipeleft", function (e) {
				e.preventDefault();
				if (!_this.doing) {
					_this.doing = true;
					_this.time = 0 ;
					if(2 == _this.type){
						_this.swipeLeftFunction2();
					}else{
						_this.swipeLeftFunction();
					}

				}

			});
			$(_this.trigger).on("swiperight", function (e) {
				e.preventDefault();
				if (!_this.doing) {
					_this.doing = true;
					_this.time = 0 ;
					if(2 == _this.type){
						_this.swipeRightFunction2();
					}else{
						_this.swipeRightFunction();
					}
				}
			});
		},
		swipeLeftFunction: function () {
			let _this = this;
			$(_this.trigger + ` img:eq(${_this.idx})`).animate({left: "-100%"}, _this.speed);
			$(_this.trigger + ` img:eq(${_this.nextIdx})`).animate({left: "0%"}, _this.speed, function () {
					_this.doing = false;
				});
			$(_this.trigger + ` img:eq(${_this.preIdx})`).css("left", "100%");
			_this.preIdx = _this.idx;
			_this.idx = _this.nextIdx;
			_this.nextIdx = _this.nextIdx + 1 < _this.count ? _this.nextIdx + 1 : 0;
			_this.setActive();
		},
		swipeRightFunction: function () {
			let _this = this;
			$(_this.trigger + ` img:eq(${_this.preIdx})`).animate({left: "0%"}, _this.speed, function () {
					_this.doing = false;
				});
			$(_this.trigger + ` img:eq(${_this.idx})`).animate({left: "100%"}, _this.speed);
			_this.nextIdx = _this.idx;
			_this.idx = _this.preIdx;
			_this.preIdx = _this.preIdx - 1 < 0 ? _this.count - 1 : _this.preIdx - 1;
			$(_this.trigger + ` img:eq(${_this.preIdx})`).css("left", "-100%");
			_this.setActive();
		},
		swipeLeftFunction2: function () {
			let _this = this;
			$(_this.trigger + ` img:eq(${_this.idx})`)
				.animate({marginLeft:_this.minLeft+"px",marginTop:_this.minTop+"rem",width:_this.minWidth+"px",height:_this.minHeight+"rem"},_this.speed/3)
				.animate({left: "-100%"}, _this.speed/3);
			$(_this.trigger + ` img:eq(${_this.nextIdx})`)
				.animate({marginLeft:_this.minLeft+"px",marginTop:_this.minTop+"rem",width:_this.minWidth+"px",height:_this.minHeight+"rem"},_this.speed/3)
				.animate({left: "0%"}, _this.speed/3)
				.animate({margin: "0",width:"100%",height:_this.height+"rem"}, _this.speed/3, function () {
					_this.doing = false;
				});
			$(_this.trigger + ` img:eq(${_this.preIdx})`).css("left", "100%");
			_this.preIdx = _this.idx;
			_this.idx = _this.nextIdx;
			_this.nextIdx = _this.nextIdx + 1 < _this.count ? _this.nextIdx + 1 : 0;
			_this.setActive();
		},
		swipeRightFunction2: function () {
			let _this = this;
			$(_this.trigger + ` img:eq(${_this.preIdx})`)
				.animate({marginLeft:_this.minLeft+"px",marginTop:_this.minTop+"rem",width:_this.minWidth+"px",height:_this.minHeight+"rem"},_this.speed/3)
				.animate({left: "0%"}, _this.speed/3)
				.animate({margin: "0",width:"100%",height:_this.height+"rem"}, _this.speed/3, function () {
				_this.doing = false;
				});
			$(_this.trigger + ` img:eq(${_this.idx})`)
				.animate({marginLeft:_this.minLeft+"px",marginTop:_this.minTop+"rem",width:_this.minWidth+"px",height:_this.minHeight+"rem"},_this.speed/3)
				.animate({left: "100%"}, _this.speed/3);
			_this.nextIdx = _this.idx;
			_this.idx = _this.preIdx;
			_this.preIdx = _this.preIdx - 1 < 0 ? _this.count - 1 : _this.preIdx - 1;
			$(_this.trigger + ` img:eq(${_this.preIdx})`).css("left", "-100%");
			_this.setActive();
		},
		setActive: function () {
			let _this = this;
			$(_this.trigger + ` .carouselCircle`).removeClass("carouselActive");
			$(_this.trigger + ` .carouselCircle:eq(${_this.idx})`).addClass("carouselActive");
		},
		setHtml: function () {
			let _this = this;
			$(_this.trigger).append("<div class='carouselIdx'></div>");
			$(_this.trigger + " img").each(function (idx, obj) {
				$(obj).css("z-index", _this.count - idx);
				$(_this.trigger + " .carouselIdx").append("<span class='carouselCircle'></span>");
			});

		},
		setCss: function () {
			let _this = this;
			let style = `<style>${_this.trigger}{width: 100%;height: ${_this.height}rem;}${_this.trigger} img{width: 100%;height: ${_this.height}rem;position: absolute;left:100%;}${_this.trigger} .carouselIdx{position: absolute;z-index: 871229;width: 100%;line-height: 0.2rem;height: .2rem;transform: translateY(${_this.height-0.4}rem);text-align: center;}${_this.trigger} .carouselCircle{display: inline-block;box-sizing: border-box;width: .2rem;height: .2rem;border:0.02rem solid #a1a1a1;border-radius: 50%;margin: 0 0.1rem;}${_this.trigger} .carouselActive{background-color: #0f79d1;}
</style>`;
			if ($(_this.trigger).closest("div[data-role='page']").length > 0) {
				$(_this.trigger).closest("div[data-role='page']").prepend(style);
			} else {
				$(_this.trigger).closest("head").prepend(style);
			}
		}
	};
	if (typeof exports == "object") {
		module.exports = Carousel;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return Carousel;
		})
	} else {
		window.Carousel = Carousel;
	}
})();