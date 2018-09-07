/**
 * creater:pater
 */
(function () {

	/**
	 * @param config
	 *
	 */
	function FlipSwitch(config) {
		this.flipSwitch = {};
		this.trigger = config.trigger ? config.trigger : "";
		this.onMsg = config.onMsg!=undefined ? config.onMsg : "on";
		this.offMsg = config.offMsg!=undefined ? config.offMsg : "off";
		this.onBackGroundColor = config.onBackGroundColor ? config.onBackGroundColor : "#3ea9e4";
		this.offBackGroundColor = config.offBackGroundColor ? config.offBackGroundColor : "#ffffff";
		this.circleBackGroundColor = config.circleBackGroundColor ? config.circleBackGroundColor : "#A1A1A1";
		this.height = config.height ? config.height : "0.6rem";
		this.lineWidth = config.lineWidth ? config.lineWidth : "50%";
		this.customCss = config.customCss ? config.customCss : null;
		this.changeFunction = config.changeFunction ? config.changeFunction : null;
		this.init();
	}

	FlipSwitch.prototype = {
		constructor: FlipSwitch,
		init: function () {
			let _this = this;
			_this.trigger = $.trim(_this.trigger);
			if (!_this.trigger) {
				console.error('Switch has been successfully installed, but no trigger found on your page.');
				return false;
			}
			$(_this.trigger).append(`
				<span class="onSpan">${_this.onMsg}</span><span class="circle"></span><span class="offSpan">${_this.offMsg}</span>
			`);
			_this.flipSwitch.trigger = $(_this.trigger);
			_this.flipSwitch.childSpan = $(_this.trigger + ">span");
			_this.flipSwitch.onSpan = $(_this.trigger + " .onSpan");
			_this.flipSwitch.offSpan = $(_this.trigger + " .offSpan");
			_this.flipSwitch.circle = $(_this.trigger + " .circle");
			_this.flipSwitch.value = "off";
			_this.triggerCss();
			_this.flipSwitch.offSpan.show();
			_this.flipSwitch.trigger.on("vclick", {"config": _this}, function (e) {
				e.preventDefault();
				let _this = e.data.config;
				if ("off" == _this.flipSwitch.value) {
					_this.switchOn()
				} else {
					_this.switchOff();
				}
				if(_this.changeFunction){
					_this.changeFunction();
				}
			});
			_this.flipSwitch.trigger.on("swipeleft", {"config": _this}, function (e) {
				e.preventDefault();
				let _this = e.data.config;
				_this.switchOff();
				if(_this.changeFunction){
					_this.changeFunction();
				}
			});
			_this.flipSwitch.trigger.on("swiperight", {"config": _this}, function (e) {
				e.preventDefault();
				let _this = e.data.config;
				_this.switchOn();
				if(_this.changeFunction){
					_this.changeFunction();
				}
			});
		},
		triggerCss: function () {
			let _this = this;
			_this.flipSwitch.trigger.css({
				"display": "block",
				"margin": "0 auto",
				"box-sizing": "border-box",
				"width": _this.lineWidth,
				"border-radius": "2rem",
				"border": "0.02rem solid #a1a1a1",
				"background-color": _this.offBackGroundColor
			});
			_this.customCss? _this.flipSwitch.trigger.css(_this.customCss):"";
			_this.flipSwitch.childSpan.css({"box-sizing": "border-box","height": _this.height, "width": _this.height, "line-height": _this.height});
			_this.flipSwitch.onSpan.css({"box-sizing": "border-box","float": "left", "transform": "translateX(50%)", "display": "none"});
			_this.flipSwitch.offSpan.css({"box-sizing": "border-box","float": "right", "transform": "translateX(-50%)", "display": "none"});
			_this.flipSwitch.circle.css({"box-sizing": "border-box","float": "left", "display": "block", "border-radius": "50%", "background-color": _this.circleBackGroundColor});
		},
		switchOn: function () {
			let _this = this;
			_this.flipSwitch.onSpan.show();
			_this.flipSwitch.offSpan.hide();
			_this.flipSwitch.circle.css("float", "right");
			_this.flipSwitch.trigger.css("background-color", _this.onBackGroundColor);
			_this.flipSwitch.value = "on";
		},
		switchOff: function () {
			let _this = this;
			_this.flipSwitch.onSpan.hide();
			_this.flipSwitch.offSpan.show();
			_this.flipSwitch.circle.css("float", "left");
			_this.flipSwitch.trigger.css("background-color", _this.offBackGroundColor);
			_this.flipSwitch.value = "off";
		},
		getValue: function () {
			let _this = this;
			return _this.flipSwitch.value;
		}
	};
	if (typeof exports == "object") {
		module.exports = FlipSwitch;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return FlipSwitch;
		})
	} else {
		window.FlipSwitch = FlipSwitch;
	}
})();
