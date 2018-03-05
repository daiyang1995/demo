"use strict";

function calTime() {}

// new Date("2012/12/25 20:11:11")
/**
 * @param {{today:boolean}} json 是否为今天 boolean 默认true;
 * @param {{hourUnit:String}} json 小时单位 String
 * @param {{minUnit:String}} json 分钟单位 String
 * @param {{secUnit:String}} json 秒单位 String
 * @param {{type:String}} json 需要输出类型 String 1： 小时 分钟  2: 小时 分钟 秒  默认为 2
 * @param {{timeType:String}} json 需要的时间 是在当前时间之前还是之后类型 String 1:之前 2:之后  3： 不做处理 默认2 ;
 * @param json
 */
calTime.init = function (json) {
    var isToday = true,
        date = new Date(),
        hourUnit = "时",
        minUnit = "分",
        secUnit = "秒",
        type = "2",
        timeType = "2";
    if (json) {
        if (json.today) {
            isToday = json.today;
        }
        if (json.hourUnit) {
            hourUnit = json.hourUnit;
        }
        if (json.minUnit) {
            minUnit = json.minUnit;
        }
        if (json.secUnit) {
            secUnit = json.secUnit;
        }
        if (json.type) {
            type = json.type;
        }
        if (json.timeType) {
            timeType = json.timeType;
        }
    }
    var minhour = 0,
        minmin = 0,
        minsec = 0;
    var maxhour = 24,
        maxmin = 60,
        maxsec = 60;
    var s = "[";
    if (isToday) {
        if ("2" === timeType) {
            minhour = date.getHours();
            minmin = date.getMinutes();
            minsec = date.getSeconds();
        } else if ("3" === timeType) {} else {
            maxhour = date.getHours();
            maxmin = date.getMinutes();
            maxsec = date.getSeconds();
        }
    } else {}

    switch (type) {
        case "1":
            s += calTime.getSixtyAndOneChild({
                Unit1: hourUnit,
                Unit2: minUnit,
                min1: minhour,
                max1: maxhour,
                min2: minmin,
                max2: maxmin
            });
            break;
        case "2":
            s += calTime.getSixtyAndTwoChild({
                Unit1: hourUnit,
                Unit2: minUnit,
                Unit3: secUnit,
                min1: minhour,
                max1: maxhour,
                min2: minmin,
                max2: maxmin,
                min3: minsec,
                max3: maxsec
            });
            break;
        default:
            s += calTime.getSixtyAndTwoChild({
                Unit1: hourUnit,
                Unit2: minUnit,
                Unit3: secUnit,
                min1: minhour,
                max1: maxhour,
                min2: minmin,
                max2: maxmin,
                min3: minsec,
                max3: maxsec
            });
            break;
    }
    s += "]";
    return eval(s);
};
/**
 * @param {{Unit1:String}} json 单位 String
 * @param {{min1:Integer}} json 开始时间 Integer
 * @param {{max1:Integer}} json 结束时间 Integer
 * @param json
 */
calTime.getSixtyOnly = function (json) {
    var Unit1 = "秒",
        min1 = 0,
        max1 = 60;
    if (json) {
        if (json.Unit1) Unit1 = json.Unit1;
        if (json.min1) min1 = json.min1;
        if (json.max1) max1 = json.max1;
    }
    var s = "";
    for (var iii = min1; iii < max1; iii++) {
        //sec
        var iiistr = iii;
        if (iii < 10) {
            iiistr = "0" + iii;
        }
        s += "{id:'" + iiistr + "',value:'" + iiistr + Unit1 + "'},";
    }
    s = s.substring(0, s.length - 1);
    return s;
};
/**
 * @param {{Unit1:String}} json 单位1 String
 * @param {{Unit2:String}} json 单位2 String
 * @param {{min1:Integer}} json 单位1开始时间 Integer
 * @param {{max1:Integer}} json 单位1结束时间 Integer
 * @param {{min2:Integer}} json 单位2开始时间 Integer
 * @param {{max2:Integer}} json 单位2结束时间 Integer
 * @param {{timeType:String}} json 需要的时间 是在当前时间之前还是之后类型 String 1:之前 2:之后 默认 2
 * @param json
 */
calTime.getSixtyAndOneChild = function (json) {
    var Unit1 = "分",
        Unit2 = "秒",
        min1 = 0,
        max1 = 60,
        min2 = 0,
        max2 = 60,
        timeType = "2";
    if (json) {
        if (json.Unit1) Unit1 = json.Unit1;
        if (json.Unit2) Unit2 = json.Unit2;
        if (json.min1) min1 = json.min1;
        if (json.max1) max1 = json.max1;
        if (json.min2) min2 = json.min2;
        if (json.max2) max2 = json.max2;
        if (json.timeType) timeType = json.timeType;
    }
    var checkTime = min1;
    if ("2" !== timeType) {
        checkTime = max1 - 1;
    }
    var getSixtyOnly = calTime.getSixtyOnly({
        Unit1: Unit2,
        timeType: timeType
    });
    var getSixtyOnly1 = calTime.getSixtyOnly({
        Unit1: Unit2,
        min1: min2,
        max1: max2,
        timeType: timeType
    });
    var s = "";
    for (var iii = min1; iii < max1; iii++) {
        //sec
        var iiistr = iii;
        if (iii < 10) {
            iiistr = "0" + iii;
        }
        if (iii === checkTime) {
            s += "{id:'" + iiistr + "',value:'" + iiistr + Unit1 + "',childs:[" + getSixtyOnly1 + "]},";
            continue;
        }
        s += "{id:'" + iiistr + "',value:'" + iiistr + Unit1 + "',childs:[" + getSixtyOnly + "]},";
    }
    s = s.substring(0, s.length - 1);
    return s;
};
/**
 * @param {{Unit1:String}} json 单位1 String
 * @param {{Unit2:String}} json 单位2 String
 * @param {{Unit3:String}} json 单位3 String
 * @param {{min1:Integer}} json 单位1开始时间 Integer
 * @param {{max1:Integer}} json 单位1结束时间 Integer
 * @param {{min2:Integer}} json 单位2开始时间 Integer
 * @param {{max2:Integer}} json 单位2结束时间 Integer
 * @param {{min3:Integer}} json 单位3开始时间 Integer
 * @param {{max3:Integer}} json 单位3结束时间 Integer
 * @param {{timeType:String}} json 需要的时间 是在当前时间之前还是之后类型 String 1:之前 2:之后 默认 2
 * @param json
 */
calTime.getSixtyAndTwoChild = function (json) {
    var Unit1 = "时",
        Unit2 = "分",
        Unit3 = "秒",
        min1 = 0,
        max1 = 24,
        min2 = 0,
        max2 = 60,
        min3 = 0,
        max3 = 60,
        timeType = "2";
    if (json) {
        if (json.Unit1) Unit1 = json.Unit1;
        if (json.Unit2) Unit2 = json.Unit2;
        if (json.Unit3) Unit3 = json.Unit3;
        if (json.min1) min1 = json.min1;
        if (json.max1) max1 = json.max1;
        if (json.min2) min2 = json.min2;
        if (json.max2) max2 = json.max2;
        if (json.min3) min3 = json.min3;
        if (json.max3) max3 = json.max3;
        if (json.timeType) timeType = json.timeType;
    }
    var checkTime = min1;
    if ("2" !== timeType) {
        checkTime = max1 - 1;
    }
    var getSixtyAndOneChild = calTime.getSixtyAndOneChild({
        Unit1: Unit2,
        Unit2: Unit3,
        timeType: timeType
    });
    var getSixtyAndOneChild1 = calTime.getSixtyAndOneChild({
        Unit1: Unit2,
        Unit2: Unit3,
        min1: min2,
        max1: max2,
        min2: min3,
        max2: max3,
        timeType: timeType
    });
    var s = "";
    for (var iii = min1; iii < max1; iii++) {
        //sec

        var iiistr = iii;
        if (iii < 10) {
            iiistr = "0" + iii;
        }
        if (iii === checkTime) {
            s += "{id:'" + iiistr + "',value:'" + iiistr + Unit1 + "',childs:[" + getSixtyAndOneChild1 + "]},";
            continue;
        }
        s += "{id:'" + iiistr + "',value:'" + iiistr + Unit1 + "',childs:[" + getSixtyAndOneChild + "]},";
    }
    s = s.substring(0, s.length - 1);
    return s;
};