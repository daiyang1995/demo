/**
 * http://usejsdoc.org/

 */
'use strict';

var upLoadingStatus = true;
var downLoadingStatus = true;

/**
 *
 */
function updownloading() {
}

/**
 * 用于上拉下刷加载，
 *   scroll: 内容器(默认  '.scroll' )
 *   resistance :阻力 默认0.3
 *   outerScroller : 外容器  (默认  '.outerScroller' )
 *   loading : 正在加载标识(默认 "正在加载" )
 *   upLoading : 上拉语句(默认 "上拉加载" )
 *   downLoading : 下拉语句(默认 "下拉刷新" )
 *   upFinish : 上拉完成语句（默认 "没有更多了"）
 *   downFinish : 下拉完成语句（默认 "没有更多了"）
 *   triggerHeight : 触发高度 (默认 70)
 *   upFunction : 上拉加载方法 (function名称不带（）);
 *   downFunction : 下拉刷新方法  (function名称不带（）)
 *   remove() 方法 移除正在加载
 *   upFinish() 方法 上拉没有了
 *   downFinish() 方法 下刷没有了
 *   upLoadingStatus ：上拉是否启用
 *   downLoadingStatus ： 下刷是否启用
 *
 * @param {{scroll:String}} json 内容器(默认  '.scroll' )
 * @param {{resistance:int}} json 阻力 默认0.3
 * @param {{outerScroller:String }} json 外容器  (默认  '.outerScroller' )
 * @param {{loading:String}} json 正在加载标识(默认 "正在加载" )
 * @param {{upLoading:String}} json 上拉语句(默认 "上拉加载" )
 * @param {{downLoading:String}} json 下拉语句(默认 "下拉刷新" )
 * @param {{upFinish:String}} json 上拉完成语句（默认 "没有更多了"）
 * @param {{downFinish:String}} json 下拉完成语句（默认 "没有更多了"）
 * @param {{downLoadingStatus:boolean}} json 下拉完成语句（默认 "没有更多了"）
 * @param {{triggerHeight:int}} json 触发高度 (默认 70)
 * @param {{upFunction:String}} json 上拉加载方法 (function名称不带（）);
 * @param {{downFunction:String}} json 下拉刷新方法  (function名称不带（）)
 * @param {{upLoadingStatus:boolean}} json 上拉是否启用
 * @param {{downLoadingStatus:boolean}} json 下刷是否启用
 * @param json
 */
updownloading.init = function (json) {
    var scroll, outerScroller, loading, triggerHeight, upFunction, downFunction, upLoading, downLoading, upFinish,
        downFinish;
    var touchStart = 0;
    var touchStartX = 0;
    var resistance = 0.3;
    var change = false;
    if (json) {
        //内容器
        if (json.scroll)
            scroll = json.scroll;
        else
            scroll = '.scroll';
        if (json.resistance)
            resistance = json.resistance;

        //外容器
        if (json.outerScroller)
            outerScroller = json.outerScroller;
        else
            outerScroller = '.outerScroller';
        //正在加载标识
        if (json.loading)
            loading = json.loading;
        else
            loading = "正在加载……";
        //触发高度
        if (json.triggerHeight)
            triggerHeight = json.triggerHeight;
        else
            triggerHeight = 70;
        // upFunction : 上拉加载方法 (function);
        if (json.upFunction)
            upFunction = json.upFunction;
        else {
            upFunction = null;
            upLoadingStatus = false;
        }
        //upLoadingStatus ： 上拉状态是否启用
        if (json.upLoadingStatus)
            upLoadingStatus = true;
        else {
            upLoadingStatus = false;
        }

        // downFunction : 下拉刷新方法  (function)
        if (json.downFunction)
            downFunction = json.downFunction;
        else {
            downFunction = null;
            downLoadingStatus = false;
        }
        //downLoadingStatus : 下拉状态是否启用
        if (json.downLoadingStatus)
            downLoadingStatus = true;
        else {
            downLoadingStatus = false;
        }
        //upLoading : 上拉语句(默认 "上拉加载" )
        if (json.upLoading)
            upLoading = json.upLoading;
        else
            upLoading = "上拉加载";
        //downLoading : 下拉语句(默认 "下拉刷新" )
        if (json.downLoading)
            downLoading = json.downLoading;
        else
            downLoading = "下拉刷新";
        //upFinish : 上拉完成语句（）
        if (json.upFinish)
            upFinish = json.upFinish;
        else
            upFinish = "没有更多了";
        //downFinish : 下拉完成语句（）
        if (json.downFinish)
            downFinish = json.downFinish;
        else
            downFinish = "没有更多了";

    } else {
        scroll = '.scroll';
        outerScroller = '.outerScroller';
        loading = "正在加载……";
        triggerHeight = 70;
        upFunction = null;
        downFunction = null;
        upLoadingStatus = false;
        downLoadingStatus = false;
        upLoading = "上拉加载";
        downLoading = "下拉刷新";
        upFinish = "没有更多了";
        downFinish = "没有更多了";
    }
    $(scroll).css({
        "width": "100%",
        "margin-top": "0px",
        "position": "absolute",
        "left": "0px",
        "padding": "0px",
        "top": "0px"
    });
    $(outerScroller).css({"position": "relative", "top": "0", "bottom": "0", "width": "100%", "left": "0px"});
    $(scroll).prepend("<div id='loading'>" + loading + "</div>");
    scroll = document.querySelector(scroll);
    outerScroller = document.querySelector(outerScroller);
    let loadingJquery = $('#loading');
    /**
     * @param {{targetTouches:function}} event 下刷是否启用
     */
    outerScroller.addEventListener('touchstart', (event) => {
        var touch = event.targetTouches[0];
        // 把元素放在手指所在的位置
        touchStart = touch.pageY * resistance;
        touchStartX = touch.pageX * resistance;
    }, false);
    outerScroller.addEventListener('touchmove', (event) => {
        event.stopPropagation()
        var touch = event.targetTouches[0];
        if (Math.abs(touch.pageY * resistance - touchStart) > Math.abs(touch.pageX * resistance - touchStartX)) {
            change = true;
            let i = scroll.offsetTop + ( touch.pageY ) * resistance - touchStart;
            scroll.style.top = i + 'px';
            touchStart = touch.pageY * resistance;
            var top = scroll.offsetTop;
            if (top > 0 && downLoadingStatus) {
                loadingJquery.html(downLoading);
                loadingJquery.css("bottom", "auto");
                loadingJquery.css("top", "-20px");
                loadingJquery.show();
            } else if (top < 0 && upLoadingStatus) {
                loadingJquery.html(upLoading);
                loadingJquery.css("top", "auto");
                loadingJquery.css("bottom", "-20px");
                loadingJquery.show();
            } else if (top > 0 && !(downLoadingStatus)) {
                loadingJquery.html(upFinish);
                loadingJquery.css("bottom", "auto");
                loadingJquery.css("top", "-20px");
                loadingJquery.show();
            } else if (top < 0 && !(upLoadingStatus)) {
                loadingJquery.html(downFinish);
                loadingJquery.css("top", "auto");
                loadingJquery.css("bottom", "-20px");
                loadingJquery.show();
            }
        }
    }, false);
    outerScroller.addEventListener('touchend', () => {
        if (change) {
            touchStart = 0;
            var top = scroll.offsetTop;
            //下拉刷新
            if (top > triggerHeight && downLoadingStatus) {
                loadingJquery.html(loading);
                loadingJquery.show();
                loadingJquery.css("bottom", null);
                loadingJquery.css("top", "-20px");
                downFunction();
            }
            if (top > 0) {
                var time = setInterval(() => {
                    scroll.style.top = scroll.offsetTop - 1 + 'px';
                    if (scroll.offsetTop <= -1) {
                        $(outerScroller).css("height", $(scroll).css("height"));
                        loadingJquery.hide();
                        change = false;
                        clearInterval(time);
                    }
                }, 1)
            }

            //上拉加载
            var top1 = $(scroll).outerHeight(true) - $(outerScroller).outerHeight(true);
            var to2 = scroll.offsetTop - (top + top1);
            if (top1 >= 0 && top + top1 < -1 * triggerHeight && upLoadingStatus && top < 0) {
                loadingJquery.html(loading);
                loadingJquery.show();
                loadingJquery.css("top", null);
                loadingJquery.css("bottom", "-20px");
                upFunction();
            } else if (top < -1 * triggerHeight && upLoadingStatus) {
                loadingJquery.html(loading);
                loadingJquery.show();
                loadingJquery.css("top", null);
                loadingJquery.css("bottom", "-20px");
                upFunction();
            }
            if (scroll.offsetTop < to2) {
                var time1 = setInterval(() => {
                    scroll.style.top = scroll.offsetTop + 1 + 'px';
                    if (scroll.offsetTop >= to2) {
                        $(outerScroller).css("height", $(scroll).css("height"));
                        change = false;
                        clearInterval(time1);
                        loadingJquery.hide();
                    }
                    if (top1 < 0 && scroll.offsetTop >= 1) {
                        $(outerScroller).css("height", $(scroll).css("height"));
                        change = false;
                        loadingJquery.hide();
                        clearInterval(time1);
                    }
                }, 1)
            }
        }
    }, false);
};

updownloading.remove = function () {
    $('#loading').hide();
};
updownloading.upFinish = function () {
    upLoadingStatus = false;
};
updownloading.downFinish = function () {
    downLoadingStatus = false;
};