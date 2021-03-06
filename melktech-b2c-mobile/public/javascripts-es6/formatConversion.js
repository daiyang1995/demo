/**
 * creater:pater
 */
(function () {

	function FormatConversion(config) {
	}

	FormatConversion.prototype = {
		constructor: FormatConversion,

		isWeixinBrowser: function(){
			var agent = navigator.userAgent.toLowerCase();
			if (agent.match(/MicroMessenger/i) == "micromessenger") {
				return true;
			} else {
				return false;
			}
		},
		SaferHTML: function (s) {
			var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
			var rs = "";
			for (var i = 0; i < s.length; i++) {
				rs = rs + s.substr(i, 1).replace(pattern, '');
			}
			return rs;
		},
		getFormatDate: function (day = new Date(), type = 1) {
			/* type : 1->yyyy-MM-dd 2:yyyy-MM-dd HH:mm:ss*/
			let Year;
			let Month;
			let Day;
			let CurrentDate = "";
			Year = day.getFullYear();//支持IE和火狐浏览器.
			Month = day.getMonth() + 1;
			Day = day.getDate();
			CurrentDate += Year + "-";
			CurrentDate += (Month >= 10 ? Month : "0" + Month) + "-";
			CurrentDate += Day >= 10 ? Day : "0" + Day;
			if(type == 2){
				CurrentDate += " ";
				let Hour = day.getHours();
				let Minutes = day.getMinutes();
				let Seconds = day.getSeconds();
				CurrentDate += (Hour >= 10 ? Hour : "0"+Hour )+ ":";
				CurrentDate += (Minutes >= 10 ? Minutes : "0"+Minutes) + ":";
				CurrentDate += Seconds >= 10 ? Seconds : "0"+Seconds;
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
				return this.getNowFormatDate(day);
			}
		},
		getGender : function (idCard) {
			let sexStr = "";
			if (idCard.length == 18) {
				sexStr = idCard.substring(0, 17);
			} else if (idCard.length == 15) {
				sexStr = idCard.substring(0, 6) + "19" + idCard.substring(6, 15);
			}else{
				return "";
			}
			let sex = parseInt(sexStr.substring(16, 17)) % 2 == 0? "女" :"男";
			return sex;
		},
		getDateOfBirth : function (idCard) {
			let birthdayStr;
			if (idCard.length == 18) {
				birthdayStr = idCard.substring(0, 17);
			} else if (idCard.length == 15) {
				birthdayStr = idCard.substring(0, 6) + "19" + idCard.substring(6, 15);
			}else {
				return "";
			}
			return birthdayStr.substring(6, 10)+"-"+ birthdayStr.substring(10,12)+"-"+ birthdayStr.substring(12,14);
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
