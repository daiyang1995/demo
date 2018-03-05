/**
 * http://usejsdoc.org/

 */
'use strict';

/**
 * 定义所有的弹出层 放入array中
 * @type {popupArray}
 */

var popupArray = [];
var popupI = 1229;
popupArray[0] = popupI;

/**
 *  * 弹框
 *  init(json) 弹框初始化
 *  clearAll() 可以清除所有的弹框
 */
function popup() {}

popup.Callback = function (id) {
    $('#' + id + 'screen').hide('fast');
    $('#' + id).hide('fast');
};
popup.show = function (id) {
    $('#' + id + 'screen').show('fast');
    $('#' + id).show('fast');
};
/**
 *  * 弹框初始化
 * @param json
 * @param {{popup:jquery}} json 弹框内容 默认$('#popup')
 * @param {{cancel:function}} json 取消按钮 无默认
 * @param {{submit:function}} json 确定按钮  无默认
 * @param {{cancelCallback:function}} json 确认函数
 * @param {{submitCallback:function}} json 取消函数
 * @param {{contentCss:json}} json 非遮罩自定义css 例子: "postion":"fixed","width":"70%"
 * @param {{contentScreenCss:json}} json 遮罩自定义css 例子: '"postion":"fixed","width":"70%" '
 * @returns {number}
 */
popup.init = function (json) {
    var index = popupArray.length;
    var zindx = popupArray[--index];
    var popupDom = $('#popup'),
        cancel = null,
        submit = null,
        cancelCallback = null,
        submitCallback = null,
        contentCss = null,
        contentScreenCss = null;
    if (json) {
        if (json.popup) {
            popupDom = json.popup;
        }
        if (json.cancel) {
            cancel = json.cancel;
        }
        if (json.submit) {
            submit = json.submit;
        }
        if (json.cancelCallback) {
            cancelCallback = json.cancelCallback;
        }
        if (json.submitCallback) {
            submitCallback = json.submitCallback;
        }
        if (json.contentCss) {
            contentCss = json.contentCss;
        }
        if (json.contentScreenCss) {
            contentScreenCss = json.contentScreenCss;
        }
    }
    $(popupDom).show();
    $(popupDom).wrap('<div class="ui-popup-container pop in ui-popup-active popupDialog-popup"  id="' + zindx + '" ></div>');
    var content = $('#' + zindx);
    content.before('<div class="ui-popup-screen ui-overlay-a in popupDialog-screen" id="' + zindx + 'screen"></div>');
    var contentScreen = $('#' + zindx + 'screen');
    /* 遮罩层的点击事件 */
    contentScreen.on("tap", { zindx: zindx }, function (e) {
        if (cancelCallback === null) {
            var _zindx = e.data.zindx;
            console.log(_zindx);
            popup.Callback(_zindx);
        } else {
            cancelCallback();
        }
    });
    /* 禁止遮罩层下部的移动事件 */
    contentScreen.on("touchmove", function (e) {
        e.preventDefault();
    });

    /* 取消按钮的点击事件 */
    if (cancel) {
        $(cancel).on('tap', { zindx: zindx }, function (e) {
            if (cancelCallback === null) {
                var _zindx2 = e.data.zindx;
                console.log(_zindx2);
                popup.Callback(_zindx2);
            } else {
                cancelCallback();
            }
        });
    }
    /* 确定按钮的点击事件 */
    if (submit) {
        $(submit).on('tap', { zindx: zindx }, function (e) {
            if (submitCallback === null) {
                var _zindx3 = e.data.zindx;
                popup.Callback(_zindx3);
            } else {
                submitCallback();
            }
        });
    }
    if (contentScreenCss) {
        contentScreen.css(contentScreenCss);
    }
    if (contentCss) {
        content.css(contentCss);
    }

    contentScreen.css({ 'z-index': zindx, "position": "fixed" });
    content.css({ 'z-index': ++zindx, "position": "fixed" });

    zindx++;
    popupArray[++index] = zindx;

    return zindx - 2;
};
/**
 *  清除所有弹框
 */
popup.clearAll = function () {
    for (var ii = 0; ii < popupArray.length; ii++) {
        popup.Callback(popupArray[ii]);
    }
};