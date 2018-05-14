var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var httpTool = require('../tool/httpTool');

router.all("/applicant",function(req,res,next){
	req.body = Object.assign(req.body, req.session.saleman);
	req.body.url = "apiOther/getTotalApplicant";
	httpTool(req, (res2) => {
		res2.setEncoding('utf8');
		// 响应体过大 自己拆分
		let data = "";
		res2.on('data', (chunk) => {
			data += chunk;
		});
		res2.on('end', () => {
			try {
				res.render("applicant", JSON.parse(data));
			}
			catch (e) {
				loggerError.error("applicant  :" + e.message);
			}
		});
	});
});

router.post("/getApplicantList", multipartMiddleware ,function(req, res, next) {
	req.body = Object.assign(req.body, req.session.saleman);
	req.body.url = "apiOther/getApplicantList";
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
				loggerError.error("getApplicantList  :" + e.message);
			}
		});
	});
});

module.exports = router;
