/**
 * http://usejsdoc.org/

 */
'use strict';

/**
 * 转换
 */

function formatConversion() {}

/**
 * 特殊字符转换
 * @param s String
 * @returns {string}
 * @constructor
 */
formatConversion.SaferHTML = function (s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
};

/**
 * 日期转换
 * @param day long
 * @returns {string} yyyy-mm-dd
 */
formatConversion.getNowFormatDate = function (day) {
    var Year = void 0;
    var Month = void 0;
    var Day = void 0;
    var CurrentDate = "";
    Year = day.getFullYear(); //支持IE和火狐浏览器.
    Month = day.getMonth() + 1;
    Day = day.getDate();
    CurrentDate += Year + "-";
    if (Month >= 10) {
        CurrentDate += Month + "-";
    } else {
        CurrentDate += "0" + Month + "-";
    }
    if (Day >= 10) {
        CurrentDate += Day;
    } else {
        CurrentDate += "0" + Day;
    }
    return CurrentDate;
};

/**
 * 日期转换
 * @param day long
 * @returns {string}
 */
formatConversion.getDayStr = function (day) {
    var now = new Date();
    var str = "";
    if (day.toDateString() === now.toDateString()) {
        //今天
        var s = day.getHours() + "";
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
};