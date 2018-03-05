/**
 * http://usejsdoc.org/

 */
'use strict';

function sharkTip() {}
var sharkArray = [];
sharkArray[0] = false;

/**
 * @param json
 * @param {{msg:String}} 提示信息
 * @param {{needShark:boolean}} 是否需要晃动
 * @param {{shakZindex:int}} 设置z-index
 * @param {{sharkCss:json}} json 自定义css 例子: "postion":"fixed","width":"70%"
 */
sharkTip.init = function (json) {
    var msg = json.msg ? json.msg : "内容";
    var needShark = json.needShark == true ? true : false;
    var shakZindex = json.sharkZindex ? json.sharkZindex : 9871229;
    var sharkCss = json.sharkCss ? json.sharkCss : "";
    var thisSharkId = --sharkArray.length;
    sharkArray[thisSharkId] = needShark;
    sharkArray[sharkArray.length] = false;

    $("body").append("<div id=\"shark" + thisSharkId + "\" class=\"shark\" style=\"z-index: " + shakZindex + "\"><span>" + msg + "</span></div>");

    if (sharkCss != "") {
        $("#shark" + thisSharkId).css(sharkCss);
    }
    return thisSharkId;
};
sharkTip.show = function (thisSharkId) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "内容";
    var fadeinTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 400;
    var hideTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2000;

    $("#shark" + thisSharkId + " span").html(msg + " !");
    $("#shark" + thisSharkId).fadeIn(fadeinTime);
    if (sharkArray[thisSharkId]) {
        $("#shark" + thisSharkId + " span").addClass("sharkSpan");
    }
    setTimeout(function () {
        $("#shark" + thisSharkId).fadeOut(fadeinTime);
    }, hideTime);
};