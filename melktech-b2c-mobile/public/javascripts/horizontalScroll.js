/*! melktech-pds-mobile 2018-05-31 */

"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o};!function(){function o(o){this.speed=o.speed?o.speed:50,this.scroll_JqueryDom=o.scroll_JqueryDom?o.scroll_JqueryDom:".horizontalScroll",this.init()}o.prototype={constructor:o,init:function(){var r=this;$(r.scroll_JqueryDom).each(function(){var o=this,t=$(o)[0];if(0<t.scrollWidth-t.offsetWidth-1){var e=$(o).html();$(o).html("&nbsp&nbsp"+e);var n=t.scrollWidth;$(o).html("&nbsp&nbsp"+e+"&nbsp&nbsp"+e);t.scrollWidth,t.offsetWidth,setInterval(function(){t.scrollLeft+=1,t.scrollLeft>n&&(t.scrollLeft=t.scrollLeft-n)},r.speed)}})}},"object"==("undefined"==typeof exports?"undefined":_typeof(exports))?module.exports=o:"function"==typeof define&&define.amd?define([],function(){return o}):window.HorizontalScroll=o}();
/*! melktech-pds-mobile 最后修改于： 2018-05-31 */