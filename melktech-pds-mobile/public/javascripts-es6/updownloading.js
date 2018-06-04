/**
 * creater:pater
 */
(function () {

	/**
	 * 用于上拉下刷加载，
	 *   scroll: 内容器(默认  '.scroll' )
	 *   resistance :阻力 默认0.3
	 *   outerScroller : 外容器  (默认  '.outerScroller' )
	 *   loading : 正在加载标识(默认 "正在加载" )
	 *   upLoading : 上拉语句(默认 "上拉加载" )
	 *   downLoading : 下拉语句(默认 "下拉刷新" )
	 *   upFinish : 上拉完成语句（默认 "没有更多了"）
	 *   downFinish : 下拉完成语句（默认 "没有更多了"）
	 *   triggerHeight : 触发高度 (默认 70)
	 *   upFunction : 上拉加载方法 (function名称不带（）);
	 *   downFunction : 下拉刷新方法  (function名称不带（）)
	 *   remove() 方法 移除正在加载
	 *   upFinish() 方法 上拉没有了
	 *   downFinish() 方法 下刷没有了
	 *   upFunctionParam 上拉方法参数
	 *   downFunctionParam 下刷方法参数
	 *   upLoadingStatus ：上拉是否启用
	 *   downLoadingStatus ： 下刷是否启用
	 *
	 * @param {{scroll:String}} config 内容器(默认  '.scroll' )
	 * @param {{resistance:int}} config 阻力 默认0.3
	 * @param {{outerScroller:String }} config 外容器  (默认  '.outerScroller' )
	 * @param {{loading:String}} config 正在加载标识(默认 "正在加载" )
	 * @param {{upLoading:String}} config 上拉语句(默认 "上拉加载" )
	 * @param {{downLoading:String}} config 下拉语句(默认 "下拉刷新" )
	 * @param {{upFinish:String}} config 上拉完成语句（默认 "没有更多了"）
	 * @param {{downFinish:String}} config 下拉完成语句（默认 "没有更多了"）
	 * @param {{triggerHeight:int}} config 触发高度 (默认 70)
	 * @param {{upFunction:String}} config 上拉加载方法 (function名称不带（）);
	 * @param {{downFunction:String}} config 下拉刷新方法  (function名称不带（）)
	 * @param {{upFunctionParam:json}} config 上拉加载方法参数
	 * @param {{downFunctionParam:json}} config 下拉刷新方法参数
	 * @param {{upLoadingStatus:boolean}} config 上拉是否启用
	 * @param {{downLoadingStatus:boolean}} config 下刷是否启用
	 * @param {{speed:int}} config 恢复速度
	 * @param config
	 */
	function Updownloading(config) {
		this.updownloading;
		this.scroll = (config && config.scroll)?config.scroll : ".scroll";
		this.resistance = (config && config.resistance)?config.resistance : 0.3;
		this.outerScroller = (config && config.outerScroller)?config.outerScroller : ".outerScroller";
		this.loading = (config && config.loading)?config.loading : "正在加载";
		this.upLoading = (config && config.upLoading)?config.upLoading : "上拉加载";
		this.downLoading = (config && config.downLoading)?config.downLoading : "下拉刷新";
		this.upFinish = (config && config.upFinish)?config.upFinish : "没有更多了";
		this.downFinish = (config && config.downFinish)?config.downFinish : "没有更多了";
		this.triggerHeight = (config && config.triggerHeight)?config.triggerHeight : 70;
		this.upFunction = (config && config.upFunction)?config.upFunction : null;
		this.downFunction = (config && config.downFunction)?config.downFunction : null;
		this.upFunctionParam = (config && config.upFunctionParam)?config.upFunctionParam : null;
		this.downFunctionParam = (config && config.downFunctionParam)?config.downFunctionParam : null;
		this.upLoadingStatus = (config && config.upLoadingStatus && this.upFunction);
		this.downLoadingStatus = (config && config.downLoadingStatus && this.downFunction);
		this.speed = (config && config.speed )? config.speed : 1;
		this.change = false;
		this.intervalTime ;
		this.touchStartY = 0;
		this.touchStartX = 0;
		this.scrollDom;
		this.outerScrollerDom;

		this.init();
	}

	Updownloading.prototype = {
		constructor: Updownloading,
		init: function () {
			let _this = this;
			_this.setCss();
			_this.scrollDom = document.querySelector(_this.scroll);
			_this.outerScrollerDom = document.querySelector(_this.outerScroller);

			/**
			 * @param {{targetTouches:function}} event 下刷是否启用
			 */
			_this.outerScrollerDom.addEventListener('touchstart', (event) => {
				event.preventDefault();
				var touch = event.targetTouches[0];
				// 把元素放在手指所在的位置
				_this.touchStartY = touch.pageY * _this.resistance;
				_this.touchStartX = touch.pageX * _this.resistance;
				clearInterval(_this.intervalTime);
			}, false);

			_this.outerScrollerDom.addEventListener('touchmove', (event) => {
				event.preventDefault();
				event.stopPropagation();
				var touch = event.targetTouches[0];
				if (Math.abs(touch.pageY * _this.resistance - _this.touchStartY) > Math.abs(touch.pageX * _this.resistance - _this.touchStartX)) {
					_this.change = true;
					let i = _this.scrollDom.offsetTop + ( touch.pageY ) * _this.resistance - _this.touchStartY;
					_this.scrollDom.style.top = i + 'px';
					_this.touchStartY = touch.pageY * _this.resistance;
					let top = _this.scrollDom.offsetTop;
					if (top > 0 && _this.downLoadingStatus) {
						$("#loading").html(_this.downLoading);
						$("#loading").css({"bottom":"auto","top":"-20px"});
						$("#loading").fadeIn();
					} else if (top < 0 && _this.upLoadingStatus) {
						$("#loading").html(_this.upLoading);
						$("#loading").css({"bottom":"-20px","top":"auto"});
						$("#loading").fadeIn();
					} else if (top > 0 && !(_this.downLoadingStatus)) {
						$("#loading").html(_this.downFinish);
						$("#loading").css({"bottom":"auto","top":"-20px"});
						$("#loading").fadeIn();
					} else if (top < 0 && !(_this.upLoadingStatus)) {
						$("#loading").html(_this.upFinish);
						$("#loading").css({"bottom":"-20px","top":"auto"});
						$("#loading").fadeIn();
					}
				}
			}, false);

			_this.outerScrollerDom.addEventListener('touchend', (event) => {
				event.preventDefault();
				if (_this.change) {
					event.stopPropagation();
					_this.touchStartY = 0;
					let top = _this.scrollDom.offsetTop;
					//下拉刷新
					if (top > _this.triggerHeight && _this.downLoadingStatus) {
						$("#loading").html(_this.loading);
						$("#loading").fadeIn();
						$("#loading").css({"bottom":"auto","top":"-20px"});
						_this.downFunction(_this.downFunctionParam);
					}
					if (top > 0) {
						if(_this.intervalTime)
							clearInterval(_this.intervalTime);

						_this.intervalTime = setInterval(() => {
							let num = _this.scrollDom.offsetTop - _this.speed;
							if(num < 0 ){
								num = 0 ;
							}
							_this.scrollDom.style.top = num + 'px';
							if (_this.scrollDom.offsetTop <= 0) {
								$(_this.outerScroller).css("height", $(_this.scroll).css("height"));
								$("#loading").fadeOut();
								clearInterval(_this.intervalTime);
							}
						}, 1)
					}
					//上拉加载
					var top1 = $(_this.scroll).outerHeight(true) - $(_this.outerScroller).outerHeight(true);
					var to2 = _this.scrollDom.offsetTop - (top + top1);
					if (top1 >= 0 && top + top1 < -1 * _this.triggerHeight && _this.upLoadingStatus && top < 0) {
						$("#loading").html(_this.loading);
						$("#loading").fadeIn();
						$("#loading").css({"bottom":"-20px","top":"auto"});
						_this.upFunction(_this.upFunctionParam);
					}
					if (_this.scrollDom.offsetTop < to2) {
						if(_this.intervalTime)
							clearInterval(_this.intervalTime);

						_this.intervalTime = setInterval(() => {
							let num = _this.scrollDom.offsetTop + _this.speed;
							if(num >= to2){
								num = to2;
							}else if(num >= 1){
								num = 0;
							}
							_this.scrollDom.style.top = num + 'px';
							if (_this.scrollDom.offsetTop >= to2   || (top1 < 0 &&_this.scrollDom.offsetTop  >= 0) ) {
								$(_this.outerScroller).css("height", $(_this.scroll).css("height"));
								clearInterval(_this.intervalTime);
								$("#loading").fadeOut();
							}
						}, 1)
					}
					_this.change = false;
				}
			});
		},
		setCss : function () {
			let _this = this;
			$(_this.scroll).css({"width": "100%","margin-top": "0px","position": "absolute","left": "0px","padding": "0px","top": "0px"});
			$(_this.outerScroller).css({"position": "relative", "top": "0", "bottom": "0", "width": "100%", "left": "0px"});
			$(_this.scroll).prepend("<div id='loading'>" + _this.loading + "</div>");
		},
		remove : function () {
			$('#loading').hide();
		},
		callUpFinish : function () {
			let _this = this;
			_this.upLoadingStatus = false;
		},
		callDownFinish : function () {
			let _this = this;
			_this.downLoadingStatus = false;
		},
		reSetUpFunctionParam : function (upFunctionParam) {
			let _this = this;
			_this.upFunctionParam = upFunctionParam ? upFunctionParam : null;
		},
		reSetDownFunctionParam : function (downFunctionParam) {
			let _this = this;
			_this.downFunctionParam = downFunctionParam ? downFunctionParam : null;
		}
	};


	if (typeof exports == "object") {
		module.exports = Updownloading;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return Updownloading;
		})
	} else {
		window.Updownloading = Updownloading;
	}
})();
