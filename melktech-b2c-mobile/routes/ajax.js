var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var httpTool = require('../tool/httpTool');
var co = require('co');

router.post('/placeAnOrder',  multipartMiddleware ,function(req, res, next) {
	if(!req.session.finalData || req.session.finalData.planCode != req.body.planCode){
		let json ={};
		json.ret = "-2";
		json.msg = "获取数据失败,请重新提交";
		res.send(json);
		return false;
	}
	req.body = Object.assign(req.body, req.session.finalData); //拼接 req.body 和req.query
	req.body.url = "apiOrder/placeAnOrder";
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
				loggerError.error("placeAnOrder  :" + e.message);
			}
		});
	});
});


router.post('/genOrder',  multipartMiddleware ,function(req, res, next) {
	if(!req.session.finalData || req.session.finalData.planCode != req.body.planCode){
		let json ={};
		json.ret = "-2";
		json.msg = "获取数据失败,请刷新页面";
		res.send(json);
		return false;
	}
	req.body = Object.assign(req.body, req.session.finalData); //拼接 req.body 和req.query
	req.body.url = "apiOrder/genOrder";
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
				loggerError.error("genOrder  :" + e.message);
			}
		});
	});
});

module.exports = router;
