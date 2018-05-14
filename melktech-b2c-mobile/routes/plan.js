var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var httpTool = require('../tool/httpTool');

router.all("/planList",function(req,res,next){
	if(req.session.saleman && req.session.saleman.mobile){
		//用户
		res.render("plan");
	}
	else{
		//游客
		res.render("planView");
	}

});
router.post("/getList", multipartMiddleware ,function(req, res, next) {
	req.body = Object.assign(req.body, req.session.saleman);
	req.body.url = "apiPlan/planList";
	httpTool(req, (res2) => {
		res2.setEncoding('utf8');
		// 响应体过大 自己拆分
		let data = "";
		res2.on('data', (chunk) => {
			data += chunk;
		});
		res2.on('end', () => {
			try {
				res.send(data);
			}
			catch (e) {
				loggerError.error("loginSubmit  :" + e.message);
			}
		});
	});
});
router.post("/reCreatePlanQrCode", multipartMiddleware ,function(req, res, next) {
	req.body.id = req.session.saleman.id;
	req.body.url = "apiPlan/reCreatePlanQrCode";
	httpTool(req, (res2) => {
		res2.setEncoding('utf8');
		// 响应体过大 自己拆分
		let data = "";
		res2.on('data', (chunk) => {
			data += chunk;
		});
		res2.on('end', () => {
			try {
				res.send(data);
			}
			catch (e) {
				loggerError.error("reCreatePlanQrCode  :" + e.message);
			}
		});
	});
});

module.exports = router;
