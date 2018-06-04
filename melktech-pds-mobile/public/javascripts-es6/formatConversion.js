/**
 * creater:pater
 */
(function () {

	function FormatConversion(config) {
	}

	FormatConversion.prototype = {
		constructor: FormatConversion,
		SaferHTML: function (s) {
			var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
			var rs = "";
			for (var i = 0; i < s.length; i++) {
				rs = rs + s.substr(i, 1).replace(pattern, '');
			}
			return rs;
		},
		getNowFormatDate: function (day) {
			let Year;
			let Month;
			let Day;
			let CurrentDate = "";
			Year = day.getFullYear();//支持IE和火狐浏览器.
			Month = day.getMonth() + 1;
			Day = day.getDate();
			CurrentDate += Year + "-";
			if (Month >= 10) {
				CurrentDate += Month + "-";
			}
			else {
				CurrentDate += "0" + Month + "-"
			}
			if (Day >= 10) {
				CurrentDate += Day;
			}
			else {
				CurrentDate += "0" + Day;
			}
			return CurrentDate;
		},
		getDayStr: function (day) {
			let now = new Date();
			let str = "";
			if (day.toDateString() === now.toDateString()) {
				//今天
				let s = day.getHours() + "";
				if (s.length < 2) {
					s = "0" + s;
				}
				str += s + ":";
				s = day.getMinutes() + "";
				if (s.length < 2) {
					s = "0" + s;
				}
				str += s;
				return str;
			} else if (new Date(day) < new Date()) {
				//之前
				return formatConversion.getNowFormatDate(day);
			}
		}
	};
	if (typeof exports == "object") {
		module.exports = FormatConversion;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return FormatConversion;
		})
	} else {
		window.FormatConversion = FormatConversion;
	}
})();
