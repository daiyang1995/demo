/**
 * creater:pater
 */
(function() {

	/**
	 * @param json
	 * @param {{style:String}} json 加载图形 默认circle
	 */
	function CountDown(config) {
		this.countDownInterval;
		this.countDownTime = (config &&config.time )?config.time : 60;
		this.functionName = (config &&config.functionName )?config.functionName : null;
		this.paramJson = (config &&config.paramJson )?config.paramJson : null;
		this.init(config);
	}
	CountDown.prototype = {
		constructor: CountDown,
		init: function (config) {
			let _this = this;
			$("body").append(`
				<div id="countDown">
					<div class="circleProgress_wrapper">
						<div class="wrapper left">
							<div class="circleProgress "></div>
						</div>
						<div class="wrapper right">
							<div class="circleProgress "></div>
						</div>
					</div>
					<div class="num">${_this.countDownTime}</div>
				</div>
			`);
			$("#countDown").on("touchmove", function (e) {
				e.preventDefault();
				e.stopPropagation();
			});
			$("#countDown").height($(window).height()+"px");
		},
		show : function () {
			let _this = this;
			let time = $("#countDown .num").html();
			$("#countDown .left .circleProgress").addClass("leftcircle");
			$("#countDown .right .circleProgress").addClass("rightcircle");
			$("#countDown").fadeIn();
			_this.countDownInterval = setInterval( ()=>{
				time--;
				if(1 > time){
					_this.hide();
					if(_this.functionName){
						_this.functionName(_this.paramJson);
					}
				}else {
					$("#countDown .num").html(time);
				}
			} , 1000);
		},
		hide : function () {
			let _this = this;
			clearInterval(_this.countDownInterval);
			$("#countDown").fadeOut(100);
			$("#countDown .left .circleProgress").removeClass("leftcircle");
			$("#countDown .right .circleProgress").removeClass("rightcircle");
			$("#countDown .num").html(_this.countDownTime);
		}
	};
	if (typeof exports == "object") {
		module.exports = CountDown;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return CountDown;
		})
	} else {
		window.CountDown = CountDown;
	}
})();
