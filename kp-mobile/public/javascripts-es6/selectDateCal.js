//日期计算
function calDate() {
}

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
    var yearUnit = "年", monthUnit = "月", dayUnit = "日";
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
            if (endDate - startDate > 4) {//5年判断
                return calDate.defaultDate();
            }
        }
        return calDate.calculateDate(startDate, endDate, status, yearUnit, monthUnit, dayUnit);
//		console.log(new Date("2012/12/25 20:11:11"));
    } else { //什么都没给  now()-2 -> now()+2
        return calDate.defaultDate();
    }
};
calDate.defaultDate = function () { //什么都没给  now()-2 -> now()+2
    var year = new Date().getFullYear();
    var startDate = year - 2;
    var endDate = year + 2;
    return calDate.calculateDate(startDate, endDate, -1, "年", "月", "日");
};
calDate.calculateDateAfterNow = function (startDate, endDate, status = 100, yearUnit = "年", monthUnit = "月", dayUnit = "日", startDateMonth, startDateDay) {
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
    let fullLeapYearMonth = calDate.calculateFullLeapYearMonth(monthUnit, dayUnit);
    let fullNotLeapYearMonth = calDate.calculateFullNotLeapYearMonth(monthUnit, dayUnit);
    var s = "[";
    let startDateStr = startDate + "";
    for (let len = startDateStr.length; len < 4; len++) {
        startDateStr = "0" + startDateStr;
    }
    var ss = "{id:'" + startDateStr + "',value:'" + startDateStr + yearUnit + "',childs:[";
    for (var ii = month; ii <= 12; ii++) {
        let iistr = ii;
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
            case 12://31天
                for (let iii = 1; iii <= 31; iii++) {
                    if (ii === month && iii < date) {
                        continue;
                    }
                    let iiistr = iii;
                    if (iii < 10) {
                        iiistr = "0" + iii;
                    }
                    ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},"
                }
                break;
            case 2:
                if (calDate.checkLeapYear(i)) {//是闰年29天
                    for (let iii = 1; iii <= 29; iii++) {
                        if (ii === month && iii < date) {
                            continue;
                        }
                        let iiistr = iii;
                        if (iii < 10) {
                            iiistr = "0" + iii;
                        }
                        ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},"
                    }
                } else {//不是闰年 28天
                    for (let iii = 1; iii <= 28; iii++) {
                        if (ii === month && iii < date) {
                            continue;
                        }
                        let iiistr = iii;
                        if (iii < 10) {
                            iiistr = "0" + iii;
                        }
                        ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},"
                    }
                }
                break;
            case 4:
            case 6:
            case 9:
            case 11: //30天
                for (var iii = 1; iii <= 30; iii++) {
                    if (ii === month && iii < date) {
                        continue;
                    }
                    let iiistr = iii;
                    if (iii < 10) {
                        iiistr = "0" + iii;
                    }
                    ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},"
                }
                break;
        }
        ss = ss.substring(0, ss.length - 1);
        ss += "]},"
    }
    ss = ss.substring(0, ss.length - 1);
    ss += "]},";
    s += ss;


    for (var i = startDate + 1; i <= endDate; i++) {
        let istr = i + "";
        for (var len = istr.length; len < 4; len++) {
            istr = "0" + istr;
        }
        if (calDate.checkLeapYear(i))
            s += "{id:'" + istr + "',value:'" + istr + yearUnit + "',childs:[" + fullLeapYearMonth + "]},";
        else
            s += "{id:'" + istr + "',value:'" + istr + yearUnit + "',childs:[" + fullNotLeapYearMonth + "]},";
    }
    s = s.substring(0, s.length - 1);
    s += "]";
    return eval(s);
};

calDate.calculateDate = function (startDate, endDate, status = -1, yearUnit = "年", monthUnit = "月", dayUnit = "日") {
    var month, date;
    if (status && status === 99) {
        var now = new Date();
        endDate = now.getFullYear();
        month = now.getMonth() + 1;
        date = now.getDate();
    }
    let fullLeapYearMonth = calDate.calculateFullLeapYearMonth(monthUnit, dayUnit);
    let fullNotLeapYearMonth = calDate.calculateFullNotLeapYearMonth(monthUnit, dayUnit);
    var s = "[";
    for (var i = startDate; i < endDate; i++) {
        let istr = i + "";
        for (let len = istr.length; len < 4; len++) {
            istr = "0" + istr;
        }
        if (calDate.checkLeapYear(i))
            s += "{id:'" + istr + "',value:'" + istr + yearUnit + "',childs:[" + fullLeapYearMonth + "]},";
        else
            s += "{id:'" + istr + "',value:'" + istr + yearUnit + "',childs:[" + fullNotLeapYearMonth + "]},";

    }
    if (status && status === 99) {
        let istr = endDate + "";
        for (let len = istr.length; len < 4; len++) {
            istr = "0" + istr;
        }
        var ss = "{id:'" + istr + "',value:'" + istr + yearUnit + "',childs:[";
        for (var ii = 1; ii <= 12; ii++) {
            if (status && status === 99 && i === endDate && ii > month) {
                break;
            }
            let iistr = ii;
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
                case 12://31天
                    for (let iii = 1; iii <= 31; iii++) {
                        if (status && status === 99 && i === endDate && ii === month && iii > date) {
                            break;
                        }
                        let iiistr = iii;
                        if (iii < 10) {
                            iiistr = "0" + iii;
                        }
                        ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},"
                    }
                    break;
                case 2:
                    if (calDate.checkLeapYear(i)) {//是闰年29天
                        for (let iii = 1; iii <= 29; iii++) {
                            if (status && status === 99 && i === endDate && ii === month && iii > date) {
                                break;
                            }
                            let iiistr = iii;
                            if (iii < 10) {
                                iiistr = "0" + iii;
                            }
                            ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},"
                        }
                    } else {//不是闰年 28天
                        for (let iii = 1; iii <= 28; iii++) {
                            if (status && status === 99 && i === endDate && ii === month && iii > date) {
                                break;
                            }
                            let iiistr = iii;
                            if (iii < 10) {
                                iiistr = "0" + iii;
                            }
                            ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},"
                        }
                    }
                    break;
                case 4:
                case 6:
                case 9:
                case 11: //30天
                    for (var iii = 1; iii <= 30; iii++) {
                        if (status && status === 99 && i === endDate && ii === month && iii > date) {
                            break;
                        }
                        let iiistr = iii;
                        if (iii < 10) {
                            iiistr = "0" + iii;
                        }
                        ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},"
                    }
                    break;
            }
            ss = ss.substring(0, ss.length - 1);
            ss += "]},"
        }
        ss = ss.substring(0, ss.length - 1);
        ss += "]},";
        s += ss;
    }

    else {
        let istr = endDate + "";
        for (var len = istr.length; len < 4; len++) {
            istr = "0" + istr;
        }
        if (calDate.checkLeapYear(endDate))
            s += "{id:'" + istr + "',value:'" + istr + yearUnit + "',childs:[" + fullLeapYearMonth + "]},";
        else
            s += "{id:'" + istr + "',value:'" + istr + yearUnit + "',childs:[" + fullNotLeapYearMonth + "]},";
    }
    s = s.substring(0, s.length - 1);
    s += "]";
    return eval(s);

};

calDate.checkLeapYear = function (i) {
    let cond1 = i % 4 === 0;  //条件1：年份必须要能被4整除
    let cond2 = i % 100 !== 0;  //条件2：年份不能是整百数
    let cond3 = i % 400 === 0;  //条件3：年份是400的倍数
    return cond1 && cond2 || cond3;
};
calDate.calculateFullDay = function (day = 31, dayUnit = "日") {
    let ss = "";
    for (let iii = 1; iii <= day; iii++) {
        let iiistr = iii;
        if (iii < 10) {
            iiistr = "0" + iii;
        }
        ss += "{id:'" + iiistr + "',value:'" + iiistr + dayUnit + "'},"
    }
    return ss.substring(0, ss.length - 1);
};
calDate.calculateFullLeapYearMonth = function (monthUnit = "月", dayUnit = "日") {
    let day31 = calDate.calculateFullDay(31, dayUnit);
    let day30 = calDate.calculateFullDay(30, dayUnit);
    let day29 = calDate.calculateFullDay(29, dayUnit);
    let ss = "";
    for (let iii = 1; iii <= 12; iii++) {
        let iiistr = iii;
        if (iii < 10) {
            iiistr = "0" + iii;
        }
        ss += "{id:'" + iiistr + "',value:'" + iiistr + monthUnit + "',childs:[";
        switch (iii + "") {
            case "1":
            case "3":
            case"5":
            case"7":
            case"8":
            case"10":
            case"12":
                ss += day31;
                break;
            case "4":
            case"6":
            case"9":
            case"11":
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
calDate.calculateFullNotLeapYearMonth = function (monthUnit = "月", dayUnit = "日") {
    let day31 = calDate.calculateFullDay(31, dayUnit);
    let day30 = calDate.calculateFullDay(30, dayUnit);
    let day29 = calDate.calculateFullDay(28, dayUnit);
    let ss = "";
    for (let iii = 1; iii <= 12; iii++) {
        let iiistr = iii;
        if (iii < 10) {
            iiistr = "0" + iii;
        }
        ss += "{id:'" + iiistr + "',value:'" + iiistr + monthUnit + "',childs:[";
        switch (iii + "") {
            case "1":
            case "3":
            case"5":
            case"7":
            case"8":
            case"10":
            case"12":
                ss += day31;
                break;
            case "4":
            case"6":
            case"9":
            case"11":
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