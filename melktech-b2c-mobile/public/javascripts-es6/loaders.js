/**
 * creater:pater
 */
(function() {

	function getClass(dom,string) {
		return dom.getElementsByClassName(string);
	}

	/**
	 * @param json
	 * @param {{style:String}} json 加载图形 默认circle
	 */
	function Loaders(config) {
		this.Loaders;
		this.style = (config &&config.style )?config.style : "circle";
		this.init(config);
	}
	Loaders.prototype = {
		constructor: Loaders,
		init: function (config) {
			let _this = this;
			_this.style = (['circle','circle-side','arrow-circle','ball-scale','ball-circle','rectangle'
				,'heart','ball-rotate','ball-pulse','jumping','satellite'].filter(function(data){ return _this.style.indexOf(data) > -1; }).length > 0)?_this.style :"circle" ;
		},
		hide : function () {
			$("#screen").fadeOut(100);
			setTimeout(function(){$("#screen").remove();} ,100);
		},
		show : function () {
			let _this = this;
			$("body").append(`<div  id="screen"><div id="screenLoading" data-loader="${_this.style}"></div></div>`);
		}
	};
	if (typeof exports == "object") {
		module.exports = Loaders;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return Loaders;
		})
	} else {
		window.Loaders = Loaders;
	}
})();
