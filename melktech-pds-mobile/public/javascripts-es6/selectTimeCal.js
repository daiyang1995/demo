/**
 * creater:pater
 */
(function () {

	/**
	 * @param config
	 * @param {{hourUnit:String}} config 小时单位 String
	 * @param {{minUnit:String}} config 分钟单位 String
	 * @param {{secUnit:String}} config 秒单位 String
	 * @param {{startHour:int }} config 开始小时 int
	 * @param {{endHour:int }} config 结束小时 int
	 * @param {{startMin:int }} config 开始分钟 int
	 * @param {{endMin:int }} config 结束分钟 int
	 * @param {{startSec:int }} config 开始秒 int
	 * @param {{endSec:int }} config 结束秒 int
	 * @param {{type:String}} config 需要输出类型 String 1->小时 2->分钟 3->秒 4->小时-分钟 5->小时-分钟-秒 6->分钟-秒  默认->5
	 * @constructor
	 */
	function CalTime(config) {
		this.calTime = {};
		this.hourUnit = config.hourUnit ? config.hourUnit : "时";
		this.minUnit = config.minUnit ? config.minUnit : "分";
		this.secUnit = config.secUnit ? config.secUnit : "秒";
		this.startHour = config.startHour ? config.startHour : 1;
		this.endHour = config.endHour ? config.endHour : 24;
		this.startMin = config.startMin ? config.startMin : 1;
		this.endMin = config.endMin ? config.endMin : 60;
		this.startSec = config.startSec ? config.startSec : 1;
		this.endSec = config.endSec ? config.endSec : 60;
		this.type = config.type ? config.type : "5";
		this.init();
	}

	CalTime.prototype = {
		constructor: CalTime,
		init: function () {
			let _this = this;
			switch (_this.type) {
				case "1": {
					_this.calTime.value = _this.getHour(1, _this.startHour, _this.endHour);
					break;
				}
				case "2": {
					_this.calTime.value = _this.getMin(1, _this.startMin, _this.endMin);
					break
				}
				case "3" : {
					_this.calTime.value = _this.getSec(_this.startSec, _this.endSec);
					break;
				}
				case "4": {
					_this.calTime.value = _this.getHour(2, _this.startHour, _this.endHour, _this.startMin, _this.endMin);
					break;
				}
				case "5": {
					_this.calTime.value = _this.getHour(3, _this.startHour, _this.endHour, _this.startMin, _this.endMin, _this.startSec, _this.endSec);
					break;
				}
				case "6": {
					_this.calTime.value = _this.getMin(2, _this.startMin, _this.endMin, _this.startSec, _this.endSec);
					break;
				}
				default: {
					_this.calTime.value = _this.getHour(3, _this.startHour, _this.endHour, _this.startMin, _this.endMin, _this.startSec, _this.endSec);
					break;
				}
			}
		},
		getValue: function () {
			let _this = this;
			return _this.calTime.value;
		},
		getHour: function (level = 1, startHour = 1, endHour = 24, startMin = 1, endMin = 60, startSec = 1, endSec = 60) {
			let _this = this;
			let hourUnit = _this.hourUnit;
			let hourJsonArray = [];
			if (level == 1) {
				for (let i = startHour; i < endHour; i++) {
					let hourJson = {};
					let istr = i < 10 ? "0" + i : "" + i;
					hourJson.id = istr;
					hourJson.value = istr + hourUnit;
					hourJsonArray.push(hourJson);
				}
			}
			else if (level == 2) {
				if (startHour == endHour) {
					let minChild = _this.getMin(1, startMin, endMin);
					let hourJson = {};
					let istr = startHour < 10 ? "0" + startHour : "" + startHour;
					hourJson.id = istr;
					hourJson.value = istr + hourUnit;
					hourJson.childs = minChild;
					hourJsonArray.push(hourJson);
				} else {
					let minChild = _this.getMin(1, startMin, 60);
					let hourJson = {};
					let istr = startHour < 10 ? "0" + startHour : "" + startHour;
					hourJson.id = istr;
					hourJson.value = istr + hourUnit;
					hourJson.childs = minChild;
					hourJsonArray.push(hourJson);
					let fullChild = _this.getMin(1, 1, 60);
					for (let i = startHour + 1; i < endHour - 1; i++) {
						let hourJson = {};
						let istr1 = i < 10 ? "0" + i : "" + i;
						hourJson.id = istr1;
						hourJson.value = istr1 + hourUnit;
						hourJson.childs = fullChild;
						hourJsonArray.push(hourJson);
					}
					let minChild1 = _this.getMin(1, 1, endMin);
					let hourJson1 = {};
					let istr1 = (endHour - 1) < 10 ? "0" + (endHour - 1) : "" + (endHour - 1);
					hourJson1.id = istr1;
					hourJson1.value = istr1 + hourUnit;
					hourJson1.childs = minChild1;
					hourJsonArray.push(hourJson1);
				}
			}
			else if (level == 3) {
				if (startHour == endHour) {
					let minChild = _this.getMin(2, startMin, endMin, startSec, endSec);
					let hourJson = {};
					let istr = startHour < 10 ? "0" + startHour : "" + startHour;
					hourJson.id = istr;
					hourJson.value = istr + hourUnit;
					hourJson.childs = minChild;
					hourJsonArray.push(hourJson);
				} else {
					let minChild = _this.getMin(2, startMin, 60, startSec, endSec);
					let hourJson = {};
					let istr = startHour < 10 ? "0" + startHour : "" + startHour;
					hourJson.id = istr;
					hourJson.value = istr + hourUnit;
					hourJson.childs = minChild;
					hourJsonArray.push(hourJson);
					let fullChild = _this.getMin(2, 1, 60, 1, 60);
					for (let i = startHour + 1; i < endHour - 1; i++) {
						let hourJson = {};
						let istr1 = i < 10 ? "0" + i : "" + i;
						hourJson.id = istr1;
						hourJson.value = istr1 + hourUnit;
						hourJson.childs = fullChild;
						hourJsonArray.push(hourJson);
					}
					let minChild1 = _this.getMin(2, 1, endMin, startSec, endSec);
					let hourJson1 = {};
					let istr1 = (endHour - 1) < 10 ? "0" + (endHour - 1) : "" + (endHour - 1);
					hourJson1.id = istr1;
					hourJson1.value = istr1 + hourUnit;
					hourJson1.childs = minChild1;
					hourJsonArray.push(hourJson1);
				}
			}
			return hourJsonArray;
		},
		getMin: function (level = 1, startMin = 1, endMin = 60, startSec = 1, endSec = 60,) {
			let _this = this;
			let minUnit = _this.minUnit;
			let minJsonArray = [];
			if (level == 1) {
				for (let i = startMin; i < endMin; i++) {
					let minJson = {};
					let istr = i < 10 ? "0" + i : "" + i;
					minJson.id = istr;
					minJson.value = istr + minUnit;
					minJsonArray.push(minJson);
				}
			} else {
				if (startMin == endMin) {
					let secChild = _this.getSec(startSec, endSec);
					let minJson = {};
					let istr = startMin < 10 ? "0" + startMin : "" + startMin;
					minJson.id = istr;
					minJson.value = istr + minUnit;
					minJson.childs = secChild;
					minJsonArray.push(minJson);
				} else {
					let secChild = _this.getSec(startSec, 60);
					let minJson = {};
					let istr = startMin < 10 ? "0" + startMin : "" + startMin;
					minJson.id = istr;
					minJson.value = istr + minUnit;
					minJson.childs = secChild;
					minJsonArray.push(minJson);
					let fullChild = _this.getSec(1, 60);
					for (let i = startMin + 1; i < endMin - 1; i++) {
						let minJson = {};
						let istr1 = i < 10 ? "0" + i : "" + i;
						minJson.id = istr1;
						minJson.value = istr1 + minUnit;
						minJson.childs = fullChild;
						minJsonArray.push(minJson);
					}
					let secChild1 = _this.getSec(1, endSec);
					let minJson1 = {};
					let istr1 = (endMin - 1) < 10 ? "0" + (endMin - 1) : "" + (endMin - 1);
					minJson1.id = istr1;
					minJson1.value = istr1 + minUnit;
					minJson1.childs = secChild1;
					minJsonArray.push(minJson1);
				}
			}
			return minJsonArray;
		},
		getSec: function (startSec = 1, endSec = 60,) {
			let _this = this;
			let secUnit = _this.secUnit;
			let secJsonArray = [];
			for (let i = startSec; i < endSec; i++) {
				let secJson = {};
				let istr = i < 10 ? "0" + i : "" + i;
				secJson.id = istr;
				secJson.value = istr + secUnit;
				secJsonArray.push(secJson);
			}
			return secJsonArray;
		}
	}
	if (typeof exports === "object") {
		module.exports = CalTime;
	} else if (typeof define === "function" && define.amd) {
		define([], function () {
			return CalTime;
		})
	} else {
		window.CalTime = CalTime;
	}
})();
