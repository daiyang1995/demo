/**
 * creater:pater
 */
(function () {

	/**
	 *
	 * @constructor
	 */
	function IdCardCheck() {
		this.init();
	}

	IdCardCheck.prototype = {
		constructor: IdCardCheck,
		init: function () {
			let _this = this;
			_this.initValue();
		},
		initValue: function () {
			let _this = this;
			//地址码
			_this.hashtable = {};
			_this.hashtable["11"] = "北京";
			_this.hashtable["12"] = "天津";
			_this.hashtable["13"] = "河北";
			_this.hashtable["14"] = "山西";
			_this.hashtable["15"] = "内蒙古";
			_this.hashtable["21"] = "辽宁";
			_this.hashtable["22"] = "吉林";
			_this.hashtable["23"] = "黑龙江";
			_this.hashtable["31"] = "上海";
			_this.hashtable["32"] = "江苏";
			_this.hashtable["33"] = "浙江";
			_this.hashtable["34"] = "安徽";
			_this.hashtable["35"] = "福建";
			_this.hashtable["36"] = "江西";
			_this.hashtable["37"] = "山东";
			_this.hashtable["41"] = "河南";
			_this.hashtable["42"] = "湖北";
			_this.hashtable["43"] = "湖南";
			_this.hashtable["44"] = "广东";
			_this.hashtable["45"] = "广西";
			_this.hashtable["46"] = "海南";
			_this.hashtable["50"] = "重庆";
			_this.hashtable["51"] = "四川";
			_this.hashtable["52"] = "贵州";
			_this.hashtable["53"] = "云南";
			_this.hashtable["54"] = "西藏";
			_this.hashtable["61"] = "陕西";
			_this.hashtable["62"] = "甘肃";
			_this.hashtable["63"] = "青海";
			_this.hashtable["64"] = "宁夏";
			_this.hashtable["65"] = "新疆";
			_this.hashtable["71"] = "台湾";
			_this.hashtable["81"] = "香港";
			_this.hashtable["82"] = "澳门";
			_this.hashtable["91"] = "国外";
			// 模量
			_this.mod = 11;
			//加权因子
			_this.Wi = ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7",
				"9", "10", "5", "8", "4", "2" ];
			//校验码
			_this.ValCodeArr = ["1", "0", "x", "9", "8", "7", "6", "5", "4",
				"3", "2" ];
		},
		checkIdCard: function (idCard) {
			let _this = this;
			const numberCheck = /^\d*$/;
			const dateCheck = /^((\d{2}(([02468][048])|([13579][26]))[-/\s]?((((0[13578])|(1[02]))[-/\s]?((0[1-9])|([1-2][0-9])|(3[01])))|(((0[469])|(11))[-/\s]?((0[1-9])|([1-2][0-9])|(30)))|(02[-/\s]?((0[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[-/\s]?((((0[13578])|(1[02]))[-/\s]?((0[1-9])|([1-2][0-9])|(3[01])))|(((0[469])|(11))[-/\s]?((0[1-9])|([1-2][0-9])|(30)))|(02[-/\s]?((0[1-9])|(1[0-9])|(2[0-8]))))))(\s(((0[0-9])|([1-2][0-3])):([0-5]?[0-9])((\s)|(:([0-5]?[0-9])))))?$/;

			idCard = idCard.replace("X","x");
			let errorInfo = "";// 记录错误信息
			let Ai = "";
			// ================ 号码的长度 15位或18位 ================
			if (idCard.length != 15 && idCard.length != 18) {
				errorInfo = "身份证号码长度应该为15位或18位";
				return errorInfo;
			}
			// =======================(end)========================

			// ================ 数字 除最后一位都为数字 ================
			if (idCard.length == 18) {
				Ai = idCard.substring(0, 17);
			} else if (idCard.length == 15) {
				Ai = idCard.substring(0, 6) + "19" + idCard.substring(6, 15);
			}
			if (numberCheck.test(Ai) == false) {
				errorInfo = "身份证15位号码都应为数字 ; 18位号码除最后一位外，都应为数字";
				return errorInfo;
			}
			// =======================(end)========================

			// ================ 出生年月是否有效 ================
			let strYear = Ai.substring(6, 10);// 年份
			let strMonth = Ai.substring(10, 12);// 月份
			let strDay = Ai.substring(12, 14);// 月份
			if (!dateCheck.test(strYear + "-" + strMonth + "-" + strDay)) {
				errorInfo = "身份证生日无效";
				return errorInfo;
			}
			if (Number(strMonth) > 12 || Number(strMonth) == 0) {
				errorInfo = "身份证月份无效";
				return errorInfo;
			}
			if (Number(strDay) > 31 || Number(strDay) == 0) {
				errorInfo = "身份证日期无效";
				return errorInfo;
			}
			// =====================(end)=====================

			// ================ 地区码时候有效 ================
			if (!(Ai.substring(0, 2) in _this.hashtable)) {
				errorInfo = "身份证地区编码错误";
				return errorInfo;
			}
			// ==============================================

			// ================ 判断最后一位的值 ================
			let numAiWi = 0;
			for (let i = 0; i < 17; i++) {
				numAiWi = numAiWi
					+ Number(Ai.substring(i , i+1))
					* Number(_this.Wi[i]);
			}
			let modValue = numAiWi % _this.mod;
			let strVerifyCode = _this.ValCodeArr[modValue];
			Ai = Ai + strVerifyCode;

			// 只有18位身份证存在最后一位校验码
			if (idCard.length == 18) {
				if (Ai != idCard) {
					errorInfo = "身份证无效，不是合法的身份证号码";
					return errorInfo;
				}
			}
			// =====================(end)=====================
			return "";

		}
	};
	if (typeof exports == "object") {
		module.exports = IdCardCheck;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return IdCardCheck;
		})
	} else {
		window.IdCardCheck = IdCardCheck;
	}
})();
