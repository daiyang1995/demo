/**
 * creater:pater
 */
(function () {
	/**
	 * @param config
	 * @param config {{msg:String}} 提示信息
	 * @param config {{needShark:boolean}} 是否需要晃动
	 * @param config {{shakZindex:int}} 设置z-index
	 * @param config {{sharkCss:json}} json 自定义css 例子: "postion":"fixed","width":"70%"
	 * @param config {{fadeinTime : int}} 设置淡入淡出时间 默认400
	 * @param config {{hideTime :int}} 设置动画时间 默认 2000
	 */
	function SharkTip(config) {
		this.SharkTip;
		this.msg = config.msg ? config.msg : "内容";
		this.needShark = config.needShark == true ? true : false;
		this.shakZindex = config.sharkZindex ? config.sharkZindex : 9871229;
		this.sharkCss = config.sharkCss ? config.sharkCss : "";
		this.sharkId = 1229;
		this.pageSharkTimeOut;
		this.fadeinTime = config.fadeinTime ? config.fadeinTime : 400;
		this.hideTime = config.hideTime ? config.hideTime : 2000;
		this.init(config);
	}

	SharkTip.prototype = {
		constructor: SharkTip,
		init: function (config) {
			let _this = this;
			while ($("#shark" + _this.sharkId).length != 0) {
				_this.sharkId = _this.sharkId + 1;
			}
			$("body").append(`<div id="shark${_this.sharkId}" class="shark" style="z-index: ${_this.shakZindex}"><span>${_this.msg}</span></div>`);

			if (_this.sharkCss) {
				$(`#shark${_this.sharkId}`).css(_this.sharkCss);
			}
		},
		show: function (msg) {
			let _this = this;
			msg = msg ? msg : _this.msg;
			clearTimeout(_this.pageSharkTimeOut);
			$(`#shark${_this.sharkId} span`).html(`${msg} !`);
			$(`#shark${_this.sharkId}`).fadeIn(_this.fadeinTime);
			$(`#shark${_this.sharkId} span`).addClass("sharkSpan");
			_this.pageSharkTimeOut = setTimeout(() => {
				$(`#shark${_this.sharkId}`).fadeOut(_this.fadeinTime);
			}, _this.hideTime);
		}
	};
	if (typeof exports == "object") {
		module.exports = SharkTip;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return SharkTip;
		})
	} else {
		window.SharkTip = SharkTip;
	}
})();
