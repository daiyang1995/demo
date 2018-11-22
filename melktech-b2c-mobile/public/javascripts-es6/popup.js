/**
 * creater:pater
 */
(function () {

	/**
	 *
	 * @param config
	 * @constructor
	 * @param {{popupDom:jqueryDom}} 需要的展示框
	 * @param {{cancel:jqueryDom}} 展示框的取消按钮
	 * @param {{submit:jqueryDom}} 展示框的确认按钮
	 * @param {{cancelCallback:String}} 点击取消按钮触发function的名称
	 * @param {{cancelCallbackParam:json}} 点击取消按钮触发function的所需参数 参数为Json格式
	 * @param {{submitCallback:String}} 点击确认按钮触发function的名称
	 * @param {{submitCallbackParam:json}} 点击确认按钮触发function的所需参数 参数为Json格式
	 * @param {{contentCss:json}} 展示框外部的样式 json格式
	 * @param {{contentScreenCss:json}} 展示框遮罩层的样式 json格式
	 */
	function Popup(config) {
		this.zIndex = 1229;
		this.content = null;
		this.contentScreen = null;
		this.popupDom = (config && config.popupDom ) ? config.popupDom : $('#popup');
		this.cancel = (config && config.cancel ) ? config.cancel : null;
		this.submit = (config && config.submit ) ? config.submit : null;
		this.cancelCallback = (config && config.cancelCallback ) ? config.cancelCallback : null;
		this.cancelCallbackParam = (config && config.cancelCallbackParam ) ? config.cancelCallbackParam : null;
		this.submitCallback = (config && config.submitCallback ) ? config.submitCallback : null;
		this.submitCallbackParam = (config && config.submitCallbackParam ) ? config.submitCallbackParam : null;
		this.contentCss = (config && config.contentCss ) ? config.contentCss : null;
		this.contentScreenCss = (config && config.contentScreenCss ) ? config.contentScreenCss : null;
		this.init();
	}

	Popup.prototype = {
		constructor: Popup,
		init: function () {
			let _this = this;
			_this.popupDom.show();
			while ($("#popup" + _this.zIndex).length !== 0) {
				_this.zIndex = _this.zIndex + 2;
			}
			_this.popupDom.wrap(`<div class="ui-popup-container pop in ui-popup-active popupDialog-popup popupContent"  id="popup${_this.zIndex}" ></div>`);
			_this.content = $('#popup' + _this.zIndex);
			_this.content.before(`<div class="ui-popup-screen ui-overlay-a in popupDialog-screen popupContentScreen" id="popup${_this.zIndex}screen"></div>`);
			_this.contentScreen = $('#popup' + _this.zIndex + 'screen');

			/* 遮罩层的点击事件 */
			_this.contentScreen.on("tap", (e) => {
				e.preventDefault();
				if (_this.cancelCallback === null) {
					_this.Callback();
				} else {
					_this.cancelCallback(_this.cancelCallbackParam);
				}
			});

			/* 禁止遮罩层下部的移动事件 */
			_this.contentScreen.on("touchmove", function (e) {
				e.preventDefault();
				e.stopPropagation();
			});
			_this.content.on("touchmove", function (e) {
				e.preventDefault();
				e.stopPropagation();
			});

			/* 取消按钮的点击事件 */
			if (_this.cancel) {
				$(_this.cancel).on('tap', (e) => {
					e.preventDefault();
					if (_this.cancelCallback === null) {
						_this.Callback();
					} else {
						_this.cancelCallback(_this.cancelCallbackParam);
					}
				});
			}
			/* 确定按钮的点击事件 */
			if (_this.submit) {
				$(_this.submit).on('tap', (e) => {
					e.preventDefault();
					if (_this.submitCallback === null) {
						_this.Callback();
					} else {
						_this.submitCallback(_this.submitCallbackParam);
					}
				});
			}
			if (_this.contentScreenCss) {
				_this.contentScreen.css(_this.contentScreenCss);
			}
			if (_this.contentCss) {
				_this.content.css(_this.contentCss);
			}

			_this.contentScreen.css({'z-index': _this.zIndex, "position": "fixed"});
			_this.content.css({'z-index': (_this.zIndex + 1), "position": "fixed"});
		},
		reSetCancelCallbackParam: function (param) {
			let _this = this;
			_this.cancelCallbackParam = param;
		},
		reSetSubmitCallbackParam: function (param) {
			let _this = this;
			_this.submitCallbackParam = param;
		},
		Callback: function (id) {
			let _this = this;
			let index = id ? id : _this.zIndex;
			$('#popup' + index + 'screen').fadeOut('fast');
			$('#popup' + index).fadeOut('fast');
		},
		show: function (id) {
			let _this = this;
			let index = id ? id : _this.zIndex;
			$('#popup' + index + 'screen').fadeIn('fast');
			$('#popup' + index).fadeIn('fast');
		},
		clearAll: function () {
			$('.popupContent').fadeOut('fast');
			$('.popupContentScreen').fadeOut('fast');
		}

	};
	if (typeof exports === "object") {
		module.exports = Popup;
	} else if (typeof define === "function" && define.amd) {
		define([], function () {
			return Popup;
		})
	} else {
		window.Popup = Popup;
	}
})();
