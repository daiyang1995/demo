/*! melktech-pds-mobile 2018-05-10 */

"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(){function e(e){this.Loaders,this.style=e&&e.style?e.style:"circle",this.init(e)}e.prototype={constructor:e,init:function(e){var t=this;t.style=0<["circle","circle-side","arrow-circle","ball-scale","ball-circle","rectangle","heart","ball-rotate","ball-pulse","jumping","satellite"].filter(function(e){return-1<t.style.indexOf(e)}).length?t.style:"circle"},hide:function(){$("#screen").fadeOut(100),setTimeout(function(){$("#screen").remove()},100)},show:function(){$("body").append('<div  id="screen"><div id="screenLoading" data-loader="'+this.style+'"></div></div>')}},"object"==("undefined"==typeof exports?"undefined":_typeof(exports))?module.exports=e:"function"==typeof define&&define.amd?define([],function(){return e}):window.Loaders=e}();
/*! melktech-pds-mobile 最后修改于： 2018-05-10 */