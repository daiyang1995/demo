/**
 * creater:pater
 */
(function () {

	/**
	 * @param config
	 * @constructor
	 * @param {{startDate:int}} config 开始时间 int
	 * @param {{endDate:int}} config 结束时间 int
	 * @param {{status:int}} config 状态 int 详见例子
	 * @param {{yearUnit:String}} config 年单位 String 例如"年"
	 * @param {{monthUnit:String}} config 月单位 String 例如"月"
	 * @param {{dayUnit:String}} config 日单位 String 例如"日"
	 * @param {{startDateMonth:int}} config 结束日期的月 int status != 99
	 * @param {{startDateDay:int}} config 结束日期的日 int  status != 99
	 * @param {{endDateMonth:int}} config 结束日期的月 int status <= 99
	 * @param {{endDateDay:int}} config 结束日期的日 int  status <= 99
	 * @param {{type:int}} config 类型 int  1->天 2->小时
	 * @param {{startDateHour:int}} config 结束日期的小时 int  status != 99
	 * @param {{endDateHour:int}} config 结束日期的小时 int  status <= 99
	 * @param {{hourUnit:String}} config 时单位 String 例如"时"
	 *
	 *  * 例子 :
	 *  当前为 2018-4-13 号 type => 1
	 *  status -> === -1 : 2016-01-01 到2020-12-31号 之间所有的天数
	 *    status -> === 99 : startDate-01-01 到 endDate-endDateMonth-endDateDay 之间所有的天数
	 *    status ->     >99 : startDate-startDateMonth-startDateDay 到 endDate-12-31  之间所有的天数
	 *  status ->    <99 : startDate-startDateMonth-startDateDay 到 endDate-endDateMonth-endDateDay  之间所有的天数
	 */
	function CalDate(config) {
		this.calDate = {};
		this.now = new Date();
		this.yearUnit = config.yearUnit ? config.yearUnit : "年";
		this.monthUnit = config.monthUnit ? config.monthUnit : "月";
		this.dayUnit = config.dayUnit ? config.dayUnit : "日";
		this.startYear = config.startDate ? config.startDate : this.now.getFullYear() - 2;
		this.endYear = config.endDate ? config.endDate : this.now.getFullYear() + 2;
		this.status = config.status ? config.status : -1;
		this.startMonth = config.startDateMonth ? (config.startDateMonth > 0 ? config.startDateMonth : 1 ) : 1;
		this.startDay = config.startDateDay ? (config.startDateDay > 0 ? config.startDateDay : 1 ) : 1;
		this.endMonth = config.endDateMonth ? (config.endDateMonth > 0 ? config.endDateMonth : 12 ) : 12;
		this.endDay = config.endDateDay ? (config.endDateDay > 0 ? config.endDateDay : 31 ) : 31;
		this.type = config.type ? ( [1,2].indexOf(config.type)  ? config.type : 1 ) : 1;
		this.startHour = config.startDateHour ? ((config.startDateHour >= 0 && config.startDateHour < 24) ? config.startDateHour : 0 ) : 0;
		this.endHour = config.endDateHour ? ((config.endDateHour >= 0 && config.endDateHour < 24) ? config.endDateHour : 23 ) : 23;
		this.hourUnit = config.hourUnit ? config.hourUnit : "时";

		this.init();
	}

	CalDate.prototype = {
		constructor: CalDate,
		init: function () {
			let _this = this;
			if (_this.startYear > _this.endYear) {
				_this.startYear = _this.now.getFullYear() - 2;
				_this.endYear = _this.now.getFullYear() + 2;
				_this.status = -1;
			}
			if (-1 === _this.status) {
				if (_this.endYear - _this.startYear > 4) {//5年判断
					_this.endYear = _this.startYear + 4;
				}
				_this.CalDate.value = _this.calculateDateAfter()
			} else if (99 === _this.status) {  //从某一天往前算
				_this.endDay = _this.checkDay(_this.endYear, _this.endMonth, _this.endDay);
				//需要参数endYear, endMonth, endDay, startYear, yearUnit, monthUnit, dayUnit
				_this.calDate.value = _this.calculateDateBefore();
			} else if (99 < _this.status) { // 从某一天往后算
				_this.startDay = _this.checkDay(_this.startYear, _this.startMonth, _this.startDay);
				//需要参数startYear, startMonth, startDay , endYear, yearUnit, monthUnit, dayUnit
				_this.calDate.value = _this.calculateDateAfter();
			} else if (99 > _this.status) { // 算某一个区间
				_this.startDay = _this.checkDay(_this.startYear, _this.startMonth, _this.startDay);
				_this.endDay = _this.checkDay(_this.endYear, _this.endMonth, _this.endDay);
				//需要参数startYear, startMonth, startDay, endYear, endMonth, endDay, yearUnit, monthUnit, dayUnit
				_this.calDate.value = _this.calculateDateBetween();
			}
		},
		getValue: function () {
			let _this = this;
			return _this.calDate.value;
		},
		calculateDateAfter: function () {
			let _this = this;
			_this.endMonth = 12;
			_this.endDay = 31;
			return _this.calculateDateBetween();
		},
		calculateDateBefore: function () {
			let _this = this;
			_this.startMonth = 1;
			_this.startDay = 1;
			return _this.calculateDateBetween();
		},
		calculateDateBetween: function () {
			let _this = this;
			let fullJsonArray = [], startYearJson = {}, endYearJson = {};
			let day31 = _this.calculateFullDay(31);
			let day30 = _this.calculateFullDay(30);
			let startYearFebDay = _this.checkLeapYear(_this.startYear) ? _this.calculateFullDay(29) : _this.calculateFullDay(28);
			let endYearFebDay = _this.checkLeapYear(_this.endYear) ? _this.calculateFullDay(29) : _this.calculateFullDay(28);
			if(_this.startYear == _this.endYear){ //只有一年
				startYearJson.id = _this.startYear + "";
				startYearJson.value = _this.startYear + _this.yearUnit;
				startYearJson.childs = [];
				if(_this.startMonth == _this.endMonth){  //只有一个月
					let startMonthStr = (10 > _this.startMonth) ? "0" + _this.startMonth : _this.startMonth + "";
					let firstChildsJson = {};
					firstChildsJson.id = startMonthStr;
					firstChildsJson.value = startMonthStr + _this.monthUnit;
					let oneDay = _this.endDay == _this.startDay ? true : false;
					switch (startMonthStr) {
						case "01":
						case "03":
						case "05":
						case "07":
						case "08":
						case "10":
						case "12":
							firstChildsJson.childs = _this.calculateFullDay(_this.endDay, _this.startDay,_this.startHour , _this.endHour , oneDay);
							break;
						case "04":
						case "06":
						case "09":
						case "11":
							firstChildsJson.childs = _this.calculateFullDay(_this.endDay, _this.startDay,_this.startHour , _this.endHour , oneDay);
							break;
						case "02":
							firstChildsJson.childs = _this.calculateFullDay(_this.checkLeapYear(_this.endYear) ? (29 > _this.endDay ? _this.endDay : 29) : (28 > _this.endDay ? _this.endDay : 28),_this.startDay,_this.startHour , _this.endHour , oneDay);
							break;
						default:
							break;
					}
					startYearJson.childs.push(firstChildsJson);
					fullJsonArray.push(startYearJson);
					return fullJsonArray;
				}
				//首月
				let startMonthStr = (10 > _this.startMonth) ? "0" + _this.startMonth : _this.startMonth + "";
				let firstChildsJson = {};
				firstChildsJson.id = startMonthStr;
				firstChildsJson.value = startMonthStr + _this.monthUnit;
				switch (startMonthStr) {
					case "01":
					case "03":
					case "05":
					case "07":
					case "08":
					case "10":
					case "12":
						firstChildsJson.childs = _this.calculateFullDay(31, _this.startDay , _this.startHour , 23);
						break;
					case "04":
					case "06":
					case "09":
					case "11":
						firstChildsJson.childs = _this.calculateFullDay(30, _this.startDay, _this.startHour , 23);
						break;
					case "02":
						firstChildsJson.childs = _this.calculateFullDay(_this.checkLeapYear(_this.startYear) ? 29 : 28, _this.startDay, _this.startHour , 23);
						break;
					default:
						break;
				}
				startYearJson.childs.push(firstChildsJson);
				//中间的月
				for (let i = _this.startMonth + 1; i < _this.endMonth; i++) {
					let startYearChildsJson = {};
					let iStr = i + "";
					if (10 > i) {
						iStr = "0" + iStr;
					}
					startYearChildsJson.id = iStr;
					startYearChildsJson.value = iStr + _this.monthUnit;
					switch (iStr) {
						case "01":
						case "03":
						case "05":
						case "07":
						case "08":
						case "10":
						case "12":
							startYearChildsJson.childs = day31;
							break;
						case "04":
						case "06":
						case "09":
						case "11":
							startYearChildsJson.childs = day30;
							break;
						case "02":
							startYearChildsJson.childs = startYearFebDay;
							break;
						default:
							break;
					}
					startYearJson.childs.push(startYearChildsJson);
				}
				//结尾的月
				let endMonthStr = (10 > _this.endMonth) ? "0" + _this.endMonth : _this.endMonth + "";
				let lastChildsJson = {};
				lastChildsJson.id = endMonthStr;
				lastChildsJson.value = endMonthStr + _this.monthUnit;
				switch (endMonthStr) {
					case "01":
					case "03":
					case "05":
					case "07":
					case "08":
					case "10":
					case "12":
						lastChildsJson.childs = _this.calculateFullDay(_this.endDay, 1, 0 ,_this.endHour);
						break;
					case "04":
					case "06":
					case "09":
					case "11":
						lastChildsJson.childs = _this.calculateFullDay(_this.endDay , 1, 0 ,_this.endHour);
						break;
					case "02":
						lastChildsJson.childs = _this.calculateFullDay(_this.checkLeapYear(_this.endYear) ? (29 > _this.endDay ? _this.endDay : 29) : (28 > _this.endDay ? _this.endDay : 28) , 1, 0 ,_this.endHour);
						break;
					default:
						break;
				}
				startYearJson.childs.push(lastChildsJson);

				fullJsonArray.push(startYearJson);
				return fullJsonArray;
			}


			//计算 _this.startYear 那一年的full
			startYearJson.id = _this.startYear + "";
			startYearJson.value = _this.startYear + _this.yearUnit;
			startYearJson.childs = [];
			let startYearFirstChildsJson = {};
			let startMonthStr = (10 > _this.startMonth) ? "0" + _this.startMonth : _this.startMonth + "";
			startYearFirstChildsJson.id = startMonthStr;
			startYearFirstChildsJson.value = startMonthStr + _this.monthUnit;
			switch (startMonthStr) {
				case "01":
				case "03":
				case "05":
				case "07":
				case "08":
				case "10":
				case "12":
					startYearFirstChildsJson.childs = _this.calculateFullDay(31, _this.startDay , _this.startHour ,23);
					break;
				case "04":
				case "06":
				case "09":
				case "11":
					startYearFirstChildsJson.childs = _this.calculateFullDay(30, _this.startDay, _this.startHour ,23);
					break;
				case "02":
					startYearFirstChildsJson.childs = _this.calculateFullDay(_this.checkLeapYear(_this.startYear) ? 29 : 28, _this.startDay, _this.startHour ,23);
					break;
				default:
					break;
			}
			startYearJson.childs.push(startYearFirstChildsJson);
			for (let i = _this.startMonth + 1; i < 13; i++) {
				let startYearChildsJson = {};
				let iStr = i + "";
				if (10 > i) {
					iStr = "0" + iStr;
				}
				startYearChildsJson.id = iStr;
				startYearChildsJson.value = iStr + _this.monthUnit;
				switch (iStr) {
					case "01":
					case "03":
					case "05":
					case "07":
					case "08":
					case "10":
					case "12":
						startYearChildsJson.childs = day31;
						break;
					case "04":
					case "06":
					case "09":
					case "11":
						startYearChildsJson.childs = day30;
						break;
					case "02":
						startYearChildsJson.childs = startYearFebDay;
						break;
					default:
						break;
				}
				startYearJson.childs.push(startYearChildsJson);
			}
			fullJsonArray.push(startYearJson);

			//计算 _this.endYear 那一年的full
			endYearJson.id = _this.endYear + "";
			endYearJson.value = _this.endYear + _this.yearUnit;
			endYearJson.childs = [];
			for (let i = 1; i < _this.endMonth; i++) {
				let endYearChildsJson = {};
				let iStr = i + "";
				if (10 > i) {
					iStr = "0" + iStr;
				}
				endYearChildsJson.id = iStr;
				endYearChildsJson.value = iStr + _this.monthUnit;
				switch (iStr) {
					case "01":
					case "03":
					case "05":
					case "07":
					case "08":
					case "10":
					case "12":
						endYearChildsJson.childs = day31;
						break;
					case "04":
					case "06":
					case "09":
					case "11":
						endYearChildsJson.childs = day30;
						break;
					case "02":
						endYearChildsJson.childs = endYearFebDay;
						break;
					default:
						break;
				}
				endYearJson.childs.push(endYearChildsJson);
			}
			let endYearLastChildsJson = {};
			let endMonthStr = (10 > _this.endMonth) ? "0" + _this.endMonth : _this.endMonth + "";
			endYearLastChildsJson.id = endMonthStr;
			endYearLastChildsJson.value = endMonthStr + _this.monthUnit;
			switch (endMonthStr) {
				case "01":
				case "03":
				case "05":
				case "07":
				case "08":
				case "10":
				case "12":
					endYearLastChildsJson.childs = _this.calculateFullDay(_this.endDay,1,0 ,_this.endHour);
					break;
				case "04":
				case "06":
				case "09":
				case "11":
					endYearLastChildsJson.childs = _this.calculateFullDay(_this.endDay,1,0 ,_this.endHour);
					break;
				case "02":
					endYearLastChildsJson.childs = _this.calculateFullDay(_this.checkLeapYear(_this.endYear) ? (29 > _this.endDay ? _this.endDay : 29) : (28 > _this.endDay ? _this.endDay : 28),1,0 ,_this.endHour );
					break;
				default:
					break;
			}
			endYearJson.childs.push(endYearLastChildsJson);

			let startNextYear = _this.startYear + 1;
			if (startNextYear < _this.endYear) {
				let leapFullYear = _this.calculateFullYearMonth(true);
				let notLeapFullYear = _this.calculateFullYearMonth(false);
				for (let i = startNextYear; i < _this.endYear; i++) {
					let yearJson = {};
					yearJson.id = i + "";
					yearJson.value = i + _this.yearUnit;
					yearJson.childs = _this.checkLeapYear(i) ? leapFullYear : notLeapFullYear;
					fullJsonArray.push(yearJson);
				}
			}
			fullJsonArray.push(endYearJson);
			return fullJsonArray;
		},

		/**
		 * 用以判断 日期和月份是否相符
		 * @param year
		 * @param month
		 * @param day
		 * @returns {*}
		 */
		checkDay: function (year, month, day) {
			let _this = this;
			if (31 <= day) {
				switch (month + "") {
					case "4":
					case "6":
					case "9":
					case "11":
						day = 30;
						break;
					case "2":
						day = _this.checkLeapYear(year) ? 29 : 28;
						break;
					default:
						day = 31;
						break;
				}
			} else if (30 === day || 29 === day) {
				day = (2 === month) ? (_this.checkLeapYear(year) ? 29 : 28) : day;
			}
			return day;
		},
		/**
		 * 判断是否为闰年
		 * @param i 年 例如：now.getFullYear();
		 * @returns {boolean}
		 */
		checkLeapYear: function (i) {
			let cond1 = i % 4 === 0;  //条件1：年份必须要能被4整除
			let cond2 = i % 100 !== 0;  //条件2：年份不能是整百数
			let cond3 = i % 400 === 0;  //条件3：年份是400的倍数
			return cond1 && cond2 || cond3;
		},
		/**
		 * 计算一一天内的小时
		 * @param startHour
		 * @param endHour
		 * @returns {Array}
		 */
		calculateFullHour:function (startHour = 0 , endHour = 23) {
			let _this = this;
			let hourUnit = _this.hourUnit;
			let hourJsonArray = [];
			for (let i = startHour; i <= endHour; i++) {
				let hourJson = {};
				let istr = i < 10 ? "0" + i : "" + i;
				hourJson.id = istr;
				hourJson.value = istr + hourUnit;
				hourJsonArray.push(hourJson);
			}
			return hourJsonArray
		},
		/**
		 * 计算一整个月 所有的天数
		 * @param day 一个月的总天数 int  默认31天
		 * @param dayUnit 日的单位 String  默认"日"
		 * @param startDay 开始的日期 int  默认1
		 * @param type 类型 1->日 2->小时
		 * @param startHour 开始小时
		 * @param endHour 结束小时
		 * @param hourUnit 小时单位
		 * @returns {Array}
		 */
		calculateFullDay: function (day = 31, startDay = 1 ,startHour = 0 ,endHour = 23 ,oneday = false) {
			let _this = this;
			let dayUnit = _this.dayUnit;
			let type = _this.type;
			let hourUnit = _this.hourUnit;
			let oneFullMonthJsonArray = [];
			for (let i = startDay; i <= day; i++) {
				let iStr = i + "";
				if (10 > i) {
					iStr = "0" + iStr;
				}
				let oneDayJson = {};
				oneDayJson.id = iStr;
				oneDayJson.value = iStr + dayUnit;
				if(1 != type ){ //类型不是到日的
					if(day == startDay &&  oneday){ //同一天
						oneDayJson.childs  = _this.calculateFullHour(startHour , endHour , hourUnit);
					}else if( i == startDay){
						oneDayJson.childs  = _this.calculateFullHour(startHour , 23 , hourUnit);
					}else if ( i == day){
						oneDayJson.childs  = _this.calculateFullHour(0 , endHour , hourUnit);
					}else{
						oneDayJson.childs  = _this.calculateFullHour(0 , 23 , hourUnit);
					}
				}
				oneFullMonthJsonArray.push(oneDayJson);
			}
			return oneFullMonthJsonArray;
		},
		/**
		 * 计算全年所有的天数
		 * @param Leap 是否为闰年 boolean 默认false
		 * @param monthUnit 月份单位 String 默认"月"
		 * @param dayUnit 天的单位 String  默认为"日"
		 * @returns {Array}
		 */
		calculateFullYearMonth: function (Leap = false) {
			let _this = this;
			let dayUnit = _this.dayUnit;
			let monthUnit = _this.monthUnit;
			let day31 = _this.calculateFullDay(31);
			let day30 = _this.calculateFullDay(30);
			let febDay;
			if (Leap) {
				febDay = _this.calculateFullDay(29);
			} else {
				febDay = _this.calculateFullDay(28);
			}
			let oneFullYearJsonArray = [];
			for (let i = 1; i < 13; i++) {
				let oneFullMonthJson = {};
				let iStr = i + "";
				if (10 > i) {
					iStr = "0" + iStr;
				}
				oneFullMonthJson.id = iStr;
				oneFullMonthJson.value = iStr + monthUnit;
				switch (iStr) {
					case "01":
					case "03":
					case "05":
					case "07":
					case "08":
					case "10":
					case "12":
						oneFullMonthJson.childs = day31;
						break;
					case "04":
					case "06":
					case "09":
					case "11":
						oneFullMonthJson.childs = day30;
						break;
					case "02":
						oneFullMonthJson.childs = febDay;
						break;
					default:
						break;
				}
				oneFullYearJsonArray.push(oneFullMonthJson);
			}
			return oneFullYearJsonArray;
		}

	};
	if (typeof exports === "object") {
		module.exports = CalDate;
	} else if (typeof define === "function" && define.amd) {
		define([], function () {
			return CalDate;
		})
	} else {
		window.CalDate = CalDate;
	}
})();
