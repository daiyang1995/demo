/*! melktech-pds-mobile 2018-05-31 */

"use strict";var upLoadingStatus=!0,downLoadingStatus=!0;function updownloading(){}updownloading.init=function(t){var a,e,u,d,p,l,i,c,r,g,h=0,f=0,w=.3,L=!1;t?(a=t.scroll?t.scroll:".scroll",t.resistance&&(w=t.resistance),e=t.outerScroller?t.outerScroller:".outerScroller",u=t.loading?t.loading:"正在加载……",d=t.triggerHeight?t.triggerHeight:70,t.upFunction?p=t.upFunction:(p=null,upLoadingStatus=!1),upLoadingStatus=!!t.upLoadingStatus,t.downFunction?l=t.downFunction:(l=null,downLoadingStatus=!1),downLoadingStatus=!!t.downLoadingStatus,i=t.upLoading?t.upLoading:"上拉加载",c=t.downLoading?t.downLoading:"下拉刷新",r=t.upFinish?t.upFinish:"没有更多了",g=t.downFinish?t.downFinish:"没有更多了"):(a=".scroll",e=".outerScroller",u="正在加载……",l=p=null,downLoadingStatus=upLoadingStatus=!(d=70),i="上拉加载",c="下拉刷新",g=r="没有更多了"),$(a).css({width:"100%","margin-top":"0px",position:"absolute",left:"0px",padding:"0px",top:"0px"}),$(e).css({position:"relative",top:"0",bottom:"0",width:"100%",left:"0px"}),$(a).prepend("<div id='loading'>"+u+"</div>"),a=document.querySelector(a),e=document.querySelector(e);var S=$("#loading");e.addEventListener("touchstart",function(t){var o=t.targetTouches[0];h=o.pageY*w,f=o.pageX*w},!1),e.addEventListener("touchmove",function(t){t.stopPropagation();var o=t.targetTouches[0];if(Math.abs(o.pageY*w-h)>Math.abs(o.pageX*w-f)){L=!0;var n=a.offsetTop+o.pageY*w-h;a.style.top=n+"px",h=o.pageY*w;var s=a.offsetTop;0<s&&downLoadingStatus?(S.html(c),S.css("bottom","auto"),S.css("top","-20px"),S.show()):s<0&&upLoadingStatus?(S.html(i),S.css("top","auto"),S.css("bottom","-20px"),S.show()):0<s&&!downLoadingStatus?(S.html(r),S.css("bottom","auto"),S.css("top","-20px"),S.show()):s<0&&!upLoadingStatus&&(S.html(g),S.css("top","auto"),S.css("bottom","-20px"),S.show())}},!1),e.addEventListener("touchend",function(){if(L){h=0;var t=a.offsetTop;if(d<t&&downLoadingStatus&&(S.html(u),S.show(),S.css("bottom",null),S.css("top","-20px"),l()),0<t)var o=setInterval(function(){a.style.top=a.offsetTop-1+"px",a.offsetTop<=-1&&($(e).css("height",$(a).css("height")),S.hide(),L=!1,clearInterval(o))},1);var n=$(a).outerHeight(!0)-$(e).outerHeight(!0),s=a.offsetTop-(t+n);if(0<=n&&t+n<-1*d&&upLoadingStatus&&t<0?(S.html(u),S.show(),S.css("top",null),S.css("bottom","-20px"),p()):t<-1*d&&upLoadingStatus&&(S.html(u),S.show(),S.css("top",null),S.css("bottom","-20px"),p()),a.offsetTop<s)var i=setInterval(function(){a.style.top=a.offsetTop+1+"px",a.offsetTop>=s&&($(e).css("height",$(a).css("height")),L=!1,clearInterval(i),S.hide()),n<0&&1<=a.offsetTop&&($(e).css("height",$(a).css("height")),L=!1,S.hide(),clearInterval(i))},1)}},!1)},updownloading.remove=function(){$("#loading").hide()},updownloading.upFinish=function(){upLoadingStatus=!1},updownloading.downFinish=function(){downLoadingStatus=!1};
/*! melktech-pds-mobile 最后修改于： 2018-05-31 */