var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var httpTool = require('../tool/httpTool');

router.all("/policyList",function(req,res,next){
		res.render("policy");
});
router.all("/friendPolicyList",function(req,res,next){
	res.render("friendPolicy");
});
router.post("/getPolicyList", multipartMiddleware ,function(req, res, next) {
	req.body = Object.assign(req.body, req.session.saleman);
	req.body.url = "apiPolicy/policyList";
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
				loggerError.error("getPolicyList  :" + e.message);
			}
		});
	});
});


router.post("/getFriendPolicyList", multipartMiddleware ,function(req, res, next) {
	req.body = Object.assign(req.body, req.session.saleman);
	req.body.url = "apiPolicy/friendPolicyList";
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
				loggerError.error("getFriendPolicyList  :" + e.message);
			}
		});
	});
});

module.exports = router;
