var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var httpTool = require('../tool/httpTool');
var AliOssDownPdfjs = require('../tool/AliOssDownPdfjs');
let cryptoTool = require('../tool/crypto');

let cryptoConf = require('../config/cryptoConf');
var co = require('co');

router.post('/sendCode',  multipartMiddleware ,function(req, res, next) {
	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);

	if(!req.session[uniqueCode]){
		let json ={};
		json.ret = "-2";
		json.msg = "获取数据失败,请重新提交";
		res.send(json);
		return false;
	}
	req.body.url = "apiTool/sendCode";
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
				loggerError.error("index  :" + e.message);
			}
		});
	});
});

router.all('/pdf', (req, res, next) => {
	let json ={};
	let url = req.query.url;
	let str = url.substring(url.lastIndexOf("/")+1) ;
	let loaclPath = './temp/'+str+".pdf";  //测试使用
	json.localPath = loaclPath;
	loggerInfo.info("pdf , body : " + loaclPath);
	co(function* () {
		yield new Promise((resolve1, reject1) => {
			var finalData = AliOssDownPdfjs.downloadPDFCo(resolve1, res, loaclPath, url,json);
		});
		yield new Promise((resolve2, reject1) => {
			AliOssDownPdfjs.getStream(res ,loaclPath);
			resolve2("ok");
		});
	});
});

router.post('/genPaymentInfo' , multipartMiddleware , (req, res, next) =>{
	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);

	req.body.planCode = req.session[uniqueCode].planCode ;
	req.body.planGroupCode = req.session[uniqueCode].planGroupCode ;
	req.body.productCode = req.session[uniqueCode].productCode;

	req.body.url = "apiTool/getPolicyInfo";
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
				loggerError.error("genPaymentInfo  :" + e.message);
			}
		});
	});
});

module.exports = router;
