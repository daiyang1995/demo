/*! melktech-pds-mobile 2018-05-31 */

"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(){function e(e){this.calTime={},this.hourUnit=e.hourUnit?e.hourUnit:"时",this.minUnit=e.minUnit?e.minUnit:"分",this.secUnit=e.secUnit?e.secUnit:"秒",this.startHour=e.startHour?e.startHour:1,this.endHour=e.endHour?e.endHour:24,this.startMin=e.startMin?e.startMin:1,this.endMin=e.endMin?e.endMin:60,this.startSec=e.startSec?e.startSec:1,this.endSec=e.endSec?e.endSec:60,this.type=e.type?e.type:"5",this.init()}e.prototype={constructor:e,init:function(){var e=this;switch(e.type){case"1":e.calTime.value=e.getHour(1,e.startHour,e.endHour);break;case"2":e.calTime.value=e.getMin(1,e.startMin,e.endMin);break;case"3":e.calTime.value=e.getSec(e.startSec,e.endSec);break;case"4":e.calTime.value=e.getHour(2,e.startHour,e.endHour,e.startMin,e.endMin);break;case"5":e.calTime.value=e.getHour(3,e.startHour,e.endHour,e.startMin,e.endMin,e.startSec,e.endSec);break;case"6":e.calTime.value=e.getMin(2,e.startMin,e.endMin,e.startSec,e.endSec);break;default:e.calTime.value=e.getHour(3,e.startHour,e.endHour,e.startMin,e.endMin,e.startSec,e.endSec)}},getValue:function(){return this.calTime.value},getHour:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:1,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:24,n=3<arguments.length&&void 0!==arguments[3]?arguments[3]:1,r=4<arguments.length&&void 0!==arguments[4]?arguments[4]:60,a=5<arguments.length&&void 0!==arguments[5]?arguments[5]:1,s=6<arguments.length&&void 0!==arguments[6]?arguments[6]:60,u=this,o=u.hourUnit,l=[];if(1==e)for(var d=t;d<i;d++){var c={},h=d<10?"0"+d:""+d;c.id=h,c.value=h+o,l.push(c)}else if(2==e)if(t==i){var v=u.getMin(1,n,r),f={},g=t<10?"0"+t:""+t;f.id=g,f.value=g+o,f.childs=v,l.push(f)}else{var p=u.getMin(1,n,60),M={},S=t<10?"0"+t:""+t;M.id=S,M.value=S+o,M.childs=p,l.push(M);for(var m=u.getMin(1,1,60),y=t+1;y<i-1;y++){var H={},b=y<10?"0"+y:""+y;H.id=b,H.value=b+o,H.childs=m,l.push(H)}var U=u.getMin(1,1,r),T={},k=i-1<10?"0"+(i-1):""+(i-1);T.id=k,T.value=k+o,T.childs=U,l.push(T)}else if(3==e)if(t==i){var w=u.getMin(2,n,r,a,s),x={},_=t<10?"0"+t:""+t;x.id=_,x.value=_+o,x.childs=w,l.push(x)}else{var j=u.getMin(2,n,60,a,s),C={},V=t<10?"0"+t:""+t;C.id=V,C.value=V+o,C.childs=j,l.push(C);for(var q=u.getMin(2,1,60,1,60),z=t+1;z<i-1;z++){var A={},B=z<10?"0"+z:""+z;A.id=B,A.value=B+o,A.childs=q,l.push(A)}var D=u.getMin(2,1,r,a,s),E={},F=i-1<10?"0"+(i-1):""+(i-1);E.id=F,E.value=F+o,E.childs=D,l.push(E)}return l},getMin:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:1,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:60,n=3<arguments.length&&void 0!==arguments[3]?arguments[3]:1,r=4<arguments.length&&void 0!==arguments[4]?arguments[4]:60,a=this,s=a.minUnit,u=[];if(1==e)for(var o=t;o<i;o++){var l={},d=o<10?"0"+o:""+o;l.id=d,l.value=d+s,u.push(l)}else if(t==i){var c=a.getSec(n,r),h={},v=t<10?"0"+t:""+t;h.id=v,h.value=v+s,h.childs=c,u.push(h)}else{var f=a.getSec(n,60),g={},p=t<10?"0"+t:""+t;g.id=p,g.value=p+s,g.childs=f,u.push(g);for(var M=a.getSec(1,60),S=t+1;S<i-1;S++){var m={},y=S<10?"0"+S:""+S;m.id=y,m.value=y+s,m.childs=M,u.push(m)}var H=a.getSec(1,r),b={},U=i-1<10?"0"+(i-1):""+(i-1);b.id=U,b.value=U+s,b.childs=H,u.push(b)}return u},getSec:function(){for(var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:60,i=this.secUnit,n=[],r=e;r<t;r++){var a={},s=r<10?"0"+r:""+r;a.id=s,a.value=s+i,n.push(a)}return n}},"object"===("undefined"==typeof exports?"undefined":_typeof(exports))?module.exports=e:"function"==typeof define&&define.amd?define([],function(){return e}):window.CalTime=e}();
/*! melktech-pds-mobile 最后修改于： 2018-05-31 */