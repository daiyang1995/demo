"use strict";

//日期计算
function calDate() {}

/**
 * @param {{startDate:String}} json 开始时间 int
 * @param {{endDate:String}} json 结束时间 int
 * @param {{status:String}} json 状态 如果有 则是不计算周期的
 * @param {{yearUnit:String}} json 年单位 String
 * @param {{monthUnit:String}} json 月单位 String
 * @param {{dayUnit:String}} json 日单位 String
 * status = 99 为出生日期 100之后为日期之后的  100为从当前之前之后
 * @param {{startDateMonth:String}} json 结束日期的月 int 大于101之后才需要
 * @param {{startDateDay:String}} json 结束日期的日 int  大于101之后才需要
 * @param json
 */
calDate.init = function (json) {
    var yearUnit = "年",
        monthUnit = "月",
        dayUnit = "日";
    if (json && json.dayUnit && json.yearUnit && json.monthUnit) {
        yearUnit = json.yearUnit;
        monthUnit = json.monthUnit;
        dayUnit = json.dayUnit;
    }

    if (json) {
        var startDate = json.startDate ? json.startDate : new Date().getFullYear();
        var endDate = json.endDate ? json.endDate : new Date().getFullYear();
        var status;
        if (json.status) {
            status = json.status;
            if (status > 99) {
                var startDateMonth = json.startDateMonth ? json.startDateMonth : 1;
                var startDateDay = json.startDateDay ? json.startDateDay : 1;
                return calDate.calculateDateAfterNow(startDate, endDate, status, yearUnit, monthUnit, dayUnit, startDateMonth, startDateDay);
            }
        } else {
            status = -1;
            if (endDate - startDate > 4) {
                //5年判断
                return calDate.defaultDate();
            }
        }
        return calDate.calculateDate(startDate, endDate, status, yearUnit, monthUnit, dayUnit);
        //		console.log(new Date("2012/12/25 20:11:11"));
    } else {
        //什么都没给  now()-2 -> now()+2
        return calDate.defaultDate();
    }
};
calDate.defaultDate = function () {
    //什么都没给  now()-2 -> now()+2
    var year = new Date().getFullYear();
    var startDate = year - 2;
    var endDate = year + 2;
    return calDate.calculateDate(startDate, endDate, -1, "年", "月", "日");
};
calDate.calculateDateAfterNow = function (startDate, endDate) {
    var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
    var yearUnit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "年";
    var monthUnit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "月";
    var dayUnit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "日";
    var startDateMonth = arguments[6];
    var startDateDay = arguments[7];

    var month, date;
    if (status === 100) {
        var now = new Date();
        startDate = now.getFullYear();
        month = now.getMonth() + 1;
        date = now.getDate();
    } else {
        month = startDateMonth;
        date = startDateDay;
    }
    var fullLeapYearMonth = calDate.calculateFullLeapYearMonth(monthUnit, dayUnit);
    var fullNotLeapYearMonth = calDate.calculateFullNotLeapYearMonth(monthUnit, dayUnit);
    var s = "[";
    var startDateStr = startDate + "";
    for (var _len = startDateStr.length; _len < 4; _len++) {
        startDateStr = "0" + startDateStr;
    }
    var ss = "{id:'" + startDateStr + "',value:'" + startDateStr + yearUnit + "',childs:[";
    for (var ii = month; ii <= 12; ii++) {
        var iistr = ii;
        if (ii < 10) {
            iistr = "0" + ii;
        }
        ss += "{id:'" + iistr + "',value:'" + iistr + monthUnit + "',childs:[";
        switch (ii) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                //31天
                for (var _iii = 1; _iii <= 31; _iii++) {
                    if (ii === month && _iii < date) {
                        continue;
                    }
                    var iiistr = _iii;
                    if (_iii < 10) {
                        iiistr = "0" + _iii;
                    }
                    ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},";
                }
                break;
            case 2:
                if (calDate.checkLeapYear(i)) {
                    //是闰年29天
                    for (var _iii2 = 1; _iii2 <= 29; _iii2++) {
                        if (ii === month && _iii2 < date) {
                            continue;
                        }
                        var _iiistr = _iii2;
                        if (_iii2 < 10) {
                            _iiistr = "0" + _iii2;
                        }
                        ss += "{id:'" + _iiistr + "',value:'" + _iiistr + dayUnit + "'},";
                    }
                } else {
                    //不是闰年 28天
                    for (var _iii3 = 1; _iii3 <= 28; _iii3++) {
                        if (ii === month && _iii3 < date) {
                            continue;
                        }
                        var _iiistr2 = _iii3;
                        if (_iii3 < 10) {
                            _iiistr2 = "0" + _iii3;
                        }
                        ss += "{id:'" + _iiistr2 + "',value:'" + _iiistr2 + dayUnit + "'},";
                    }
                }
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                //30天
                for (var iii = 1; iii <= 30; iii++) {
                    if (ii === month && iii < date) {
                        continue;
                    }
                    var _iiistr3 = iii;
                    if (iii < 10) {
                        _iiistr3 = "0" + iii;
                    }
                    ss += "{id:'" + _iiistr3 + "',value:'" + _iiistr3 + dayUnit + "'},";
                }
                break;
        }
        ss = ss.substring(0, ss.length - 1);
        ss += "]},";
    }
    ss = ss.substring(0, ss.length - 1);
    ss += "]},";
    s += ss;

    for (var i = startDate + 1; i <= endDate; i++) {
        var istr = i + "";
        for (var len = istr.length; len < 4; len++) {
            istr = "0" + istr;
        }
        if (calDate.checkLeapYear(i)) s += "{id:'" + istr + "',value:'" + istr + yearUnit + "',childs:[" + fullLeapYearMonth + "]},";else s += "{id:'" + istr + "',value:'" + istr + yearUnit + "',childs:[" + fullNotLeapYearMonth + "]},";
    }
    s = s.substring(0, s.length - 1);
    s += "]";
    return eval(s);
};

calDate.calculateDate = function (startDate, endDate) {
    var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    var yearUnit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "年";
    var monthUnit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "月";
    var dayUnit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "日";

    var month, date;
    if (status && status === 99) {
        var now = new Date();
        endDate = now.getFullYear();
        month = now.getMonth() + 1;
        date = now.getDate();
    }
    var fullLeapYearMonth = calDate.calculateFullLeapYearMonth(monthUnit, dayUnit);
    var fullNotLeapYearMonth = calDate.calculateFullNotLeapYearMonth(monthUnit, dayUnit);
    var s = "[";
    for (var i = startDate; i < endDate; i++) {
        var istr = i + "";
        for (var _len2 = istr.length; _len2 < 4; _len2++) {
            istr = "0" + istr;
        }
        if (calDate.checkLeapYear(i)) s += "{id:'" + istr + "',value:'" + istr + yearUnit + "',childs:[" + fullLeapYearMonth + "]},";else s += "{id:'" + istr + "',value:'" + istr + yearUnit + "',childs:[" + fullNotLeapYearMonth + "]},";
    }
    if (status && status === 99) {
        var _istr = endDate + "";
        for (var _len3 = _istr.length; _len3 < 4; _len3++) {
            _istr = "0" + _istr;
        }
        var ss = "{id:'" + _istr + "',value:'" + _istr + yearUnit + "',childs:[";
        for (var ii = 1; ii <= 12; ii++) {
            if (status && status === 99 && i === endDate && ii > month) {
                break;
            }
            var iistr = ii;
            if (ii < 10) {
                iistr = "0" + ii;
            }
            ss += "{id:'" + iistr + "',value:'" + iistr + monthUnit + "',childs:[";
            switch (ii) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    //31天
                    for (var _iii4 = 1; _iii4 <= 31; _iii4++) {
                        if (status && status === 99 && i === endDate && ii === month && _iii4 > date) {
                            break;
                        }
                        var iiistr = _iii4;
                        if (_iii4 < 10) {
                            iiistr = "0" + _iii4;
                        }
                        ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},";
                    }
                    break;
                case 2:
                    if (calDate.checkLeapYear(i)) {
                        //是闰年29天
                        for (var _iii5 = 1; _iii5 <= 29; _iii5++) {
                            if (status && status === 99 && i === endDate && ii === month && _iii5 > date) {
                                break;
                            }
                            var _iiistr4 = _iii5;
                            if (_iii5 < 10) {
                                _iiistr4 = "0" + _iii5;
                            }
                            ss += "{id:'" + _iiistr4 + "',value:'" + _iiistr4 + dayUnit + "'},";
                        }
                    } else {
                        //不是闰年 28天
                        for (var _iii6 = 1; _iii6 <= 28; _iii6++) {
                            if (status && status === 99 && i === endDate && ii === month && _iii6 > date) {
                                break;
                            }
                            var _iiistr5 = _iii6;
                            if (_iii6 < 10) {
                                _iiistr5 = "0" + _iii6;
                            }
                            ss += "{id:'" + _iiistr5 + "',value:'" + _iiistr5 + dayUnit + "'},";
                        }
                    }
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    //30天
                    for (var iii = 1; iii <= 30; iii++) {
                        if (status && status === 99 && i === endDate && ii === month && iii > date) {
                            break;
                        }
                        var _iiistr6 = iii;
                        if (iii < 10) {
                            _iiistr6 = "0" + iii;
                        }
                        ss += "{id:'" + _iiistr6 + "',value:'" + _iiistr6 + dayUnit + "'},";
                    }
                    break;
            }
            ss = ss.substring(0, ss.length - 1);
            ss += "]},";
        }
        ss = ss.substring(0, ss.length - 1);
        ss += "]},";
        s += ss;
    } else {
        var _istr2 = endDate + "";
        for (var len = _istr2.length; len < 4; len++) {
            _istr2 = "0" + _istr2;
        }
        if (calDate.checkLeapYear(endDate)) s += "{id:'" + _istr2 + "',value:'" + _istr2 + yearUnit + "',childs:[" + fullLeapYearMonth + "]},";else s += "{id:'" + _istr2 + "',value:'" + _istr2 + yearUnit + "',childs:[" + fullNotLeapYearMonth + "]},";
    }
    s = s.substring(0, s.length - 1);
    s += "]";
    return eval(s);
};

calDate.checkLeapYear = function (i) {
    var cond1 = i % 4 === 0; //条件1：年份必须要能被4整除
    var cond2 = i % 100 !== 0; //条件2：年份不能是整百数
    var cond3 = i % 400 === 0; //条件3：年份是400的倍数
    return cond1 && cond2 || cond3;
};
calDate.calculateFullDay = function () {
    var day = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 31;
    var dayUnit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "日";

    var ss = "";
    for (var iii = 1; iii <= day; iii++) {
        var iiistr = iii;
        if (iii < 10) {
            iiistr = "0" + iii;
        }
        ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},";
    }
    return ss.substring(0, ss.length - 1);
};
calDate.calculateFullLeapYearMonth = function () {
    var monthUnit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "月";
    var dayUnit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "日";

    var day31 = calDate.calculateFullDay(31, dayUnit);
    var day30 = calDate.calculateFullDay(30, dayUnit);
    var day29 = calDate.calculateFullDay(29, dayUnit);
    var ss = "";
    for (var iii = 1; iii <= 12; iii++) {
        var iiistr = iii;
        if (iii < 10) {
            iiistr = "0" + iii;
        }
        ss += "{id:'" + iiistr + "',value:'" + iiistr + monthUnit + "',childs:[";
        switch (iii + "") {
            case "1":
            case "3":
            case "5":
            case "7":
            case "8":
            case "10":
            case "12":
                ss += day31;
                break;
            case "4":
            case "6":
            case "9":
            case "11":
                ss += day30;
                break;
            case "2":
                ss += day29;
                break;
            default:
                break;
        }
        ss += "]},";
    }
    return ss.substring(0, ss.length - 1);
};
calDate.calculateFullNotLeapYearMonth = function () {
    var monthUnit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "月";
    var dayUnit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "日";

    var day31 = calDate.calculateFullDay(31, dayUnit);
    var day30 = calDate.calculateFullDay(30, dayUnit);
    var day29 = calDate.calculateFullDay(28, dayUnit);
    var ss = "";
    for (var iii = 1; iii <= 12; iii++) {
        var iiistr = iii;
        if (iii < 10) {
            iiistr = "0" + iii;
        }
        ss += "{id:'" + iiistr + "',value:'" + iiistr + monthUnit + "',childs:[";
        switch (iii + "") {
            case "1":
            case "3":
            case "5":
            case "7":
            case "8":
            case "10":
            case "12":
                ss += day31;
                break;
            case "4":
            case "6":
            case "9":
            case "11":
                ss += day30;
                break;
            case "2":
                ss += day29;
                break;
            default:
                break;
        }
        ss += "]},";
    }
    return ss.substring(0, ss.length - 1);
};