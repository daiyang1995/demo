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
		this.speed = (config && config.speed )? config.speed : 1000; //默认1S
		this.change = false;
		/*this.intervalTime ;*/
		this.touchStartY = 0;
		this.touchStartX = 0;
		this.scrollDom;
		this.outerScrollerDom;

		this.init();
	}

	Updownloading.prototype = {
		constructor: Updownloading,
		init: function () {
			const _this = this;
			_this.setCss();
			_this.scrollDom = document.querySelector(_this.scroll);
			_this.outerScrollerDom = document.querySelector(_this.outerScroller);

			/**
			 * @param {{targetTouches:function}} event 下刷是否启用
			 */
			_this.outerScrollerDom.addEventListener('touchstart', (event) => {
				event.preventDefault();
				const touch = event.targetTouches[0];
				// 把元素放在手指所在的位置
				_this.touchStartY = touch.pageY * _this.resistance;
				_this.touchStartX = touch.pageX * _this.resistance;
				/*clearInterval(_this.intervalTime);*/
				$(_this.scrollDom).stop(true,false);
			}, false);

			_this.outerScrollerDom.addEventListener('touchmove', (event) => {
				event.preventDefault();
				event.stopPropagation();
				const touch = event.targetTouches[0];
				if (Math.abs(touch.pageY * _this.resistance - _this.touchStartY) > Math.abs(touch.pageX * _this.resistance - _this.touchStartX)) {
					_this.change = true;
					let i = _this.scrollDom.offsetTop + ( touch.pageY ) * _this.resistance - _this.touchStartY;
					_this.scrollDom.style.top = i + 'px';
					_this.touchStartY = touch.pageY * _this.resistance;
					let top = _this.scrollDom.offsetTop;
					if (top > 0 && _this.downLoadingStatus) {
						$(_this.scroll+' .loading').html(_this.downLoading);
						$(_this.scroll+' .loading').css({"bottom":"auto","top":"-20px"});
						$(_this.scroll+' .loading').fadeIn();
					} else if (top < 0 && _this.upLoadingStatus) {
						$(_this.scroll+' .loading').html(_this.upLoading);
						$(_this.scroll+' .loading').css({"bottom":"-20px","top":"auto"});
						$(_this.scroll+' .loading').fadeIn();
					} else if (top > 0 && !(_this.downLoadingStatus)) {
						$(_this.scroll+' .loading').html(_this.downFinish);
						$(_this.scroll+' .loading').css({"bottom":"auto","top":"-20px"});
						$(_this.scroll+' .loading').fadeIn();
					} else if (top < 0 && !(_this.upLoadingStatus)) {
						$(_this.scroll+' .loading').html(_this.upFinish);
						$(_this.scroll+' .loading').css({"bottom":"-20px","top":"auto"});
						$(_this.scroll+' .loading').fadeIn();
					}
				}
			}, false);

			_this.outerScrollerDom.addEventListener('touchend', (event) => {
				event.preventDefault();
				if (_this.change) {
					event.stopPropagation();
					_this.touchStartY = 0;
					const top = _this.scrollDom.offsetTop;
					//下拉刷新
					if (top > _this.triggerHeight && _this.downLoadingStatus) {
						$(_this.scroll+' .loading').html(_this.loading);
						$(_this.scroll+' .loading').fadeIn();
						$(_this.scroll+' .loading').css({"bottom":"auto","top":"-20px"});
						_this.downFunction(_this.downFunctionParam);
					}
					if (top > 0) {
						//new

						$(_this.scrollDom).animate({"top": 0+'px'}, _this.speed,"swing",()=>{
							$(_this.outerScroller).css("height", $(_this.scroll).css("height"));
							$(_this.scroll+' .loading').fadeOut();
						});
						//old
						/*if(_this.intervalTime)
													clearInterval(_this.intervalTime);*/
						/*_this.intervalTime = setInterval(() => {
							let num = _this.scrollDom.offsetTop - _this.speed;
							if(num < 0 ){
								num = 0 ;
							}
							_this.scrollDom.style.top = num + 'px';
							if (_this.scrollDom.offsetTop <= 0) {
								$(_this.outerScroller).css("height", $(_this.scroll).css("height"));
								$(_this.scroll+' .loading').fadeOut();
								clearInterval(_this.intervalTime);
							}
						}, 1)*/
					}
					//上拉加载
					const top1 = $(_this.scroll).outerHeight(true) - $(_this.outerScroller).outerHeight(true);
					const to2 = _this.scrollDom.offsetTop - (top + top1);
					if (top1 >= 0 && top + top1 < -1 * _this.triggerHeight && _this.upLoadingStatus && top < 0) {
						$(_this.scroll+' .loading').html(_this.loading);
						$(_this.scroll+' .loading').fadeIn();
						$(_this.scroll+' .loading').css({"bottom":"-20px","top":"auto"});
						_this.upFunction(_this.upFunctionParam);
					}
					if (_this.scrollDom.offsetTop < to2) {
						let num = to2;
						if(top1 < 0){
							num = to2>0?0:to2;
						}
						$(_this.scrollDom).animate({"top": num+'px'}, _this.speed,"swing",()=>{
							$(_this.outerScroller).css("height", $(_this.scroll).css("height"));
							$(_this.scroll+' .loading').fadeOut();
						});


						//old
							/*if(_this.intervalTime)
								clearInterval(_this.intervalTime);

							_this.intervalTime = setInterval(() => {
								let num = _this.scrollDom.offsetTop + 1;
								if(num >= to2){
									num = to2;
								}else if(num >= 1){
									num = 0;
								}
								_this.scrollDom.style.top = num + 'px';
								if (_this.scrollDom.offsetTop >= to2   || (top1 < 0 &&_this.scrollDom.offsetTop  >= 0) ) {
									console.log(_this.scrollDom.offsetTop);
									$(_this.outerScroller).css("height", $(_this.scroll).css("height"));
									clearInterval(_this.intervalTime);
									$("#loading").fadeOut();
								}
							}, 1)*/
						}
					_this.change = false;
				}
			});
		},
		setCss : function () {
			const _this = this;
			$(_this.scroll).css({"width": "100%","margin-top": "0px","position": "absolute","left": "0px","padding": "0px","top": "0px"});
			$(_this.outerScroller).css({"position": "relative", "top": "0", "bottom": "0", "width": "100%", "left": "0px"});
			$(_this.scroll).prepend("<div class='loading' style='position: absolute;text-align: center;width: 100%;display: none;'>" + _this.loading + "</div>");
		},
		remove : function () {
			const _this = this;
			$(_this.scroll+' .loading').hide();
		},
		callUpFinish : function () {
			const _this = this;
			_this.upLoadingStatus = false;
		},
		callDownFinish : function () {
			const _this = this;
			_this.downLoadingStatus = false;
		},
		reSetUpFunctionParam : function (upFunctionParam) {
			const _this = this;
			_this.upFunctionParam = upFunctionParam ? upFunctionParam : null;
		},
		reSetDownFunctionParam : function (downFunctionParam) {
			const _this = this;
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
