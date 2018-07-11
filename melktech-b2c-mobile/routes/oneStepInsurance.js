var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var httpTool = require('../tool/httpTool');
var wxTool = require('../tool/wxTool');
let cryptoTool = require('../tool/crypto');

let cryptoConf = require('../config/cryptoConf');
var co = require('co');

router.all('/oneStepInsurance4mazui', function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let uniqueCode = "";
	let uniqueShareCode = uniqueCode+"wxshare";
	if ((!req.body.salemanCode && !req.body.channelOperator ) ||
		((!req.body.planCode || !req.body.planGroupCode) && !req.body.productCode) || !req.body.entCode  ) {
		loggerInfo.error(`
			req.body.salemanCode:${req.body.salemanCode},
			req.body.channelOperator:${req.body.channelOperator},
			req.body.planCode:${req.body.planCode },
			req.body.planGroupCode:${req.body.planGroupCode },
			req.body.entCode:${req.body.entCode },
			req.body.entCode:${req.body.productCode }
		`);
		let errorJson = {};
		errorJson.msg = "缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter", errorJson);
		return false;
	} else {
		uniqueCode = req.body.productCode?req.body.productCode : req.body.planCode + "-" + req.body.planGroupCode;
		req.session[uniqueCode] = {};
		req.session[uniqueCode].channelOperator = req.body.channelOperator;
		req.session[uniqueCode].salemanCode = req.body.salemanCode;
		req.session[uniqueCode].productCode = req.body.productCode;
		req.session[uniqueCode].planCode = req.body.planCode;
		req.session[uniqueCode].entCode = req.body.entCode;
		req.session[uniqueCode].planGroupCode = req.body.planGroupCode;
		uniqueShareCode = uniqueCode+"wxshare";
		req.session[uniqueShareCode] = {};
		req.session[uniqueShareCode].shareUrl = req.protocol+"://"+req.headers.host+req.originalUrl;
		req.session[uniqueShareCode].shareTitle = "分享";
		req.session[uniqueShareCode].shareContent = "分享";
		req.session[uniqueShareCode].shareImg = "";
	}
	co(function* () {
		let jsapiTicket = yield new Promise((resolve, reject) => {
			wxTool.getJsapiTicketOneStep(resolve);
		});
		yield new Promise((resolve, reject) =>{
			req.body.url = "apiPlan/genPlanDetail";
			httpTool(req, (res2) => {
				res2.setEncoding('utf8');
				// 响应体过大 自己拆分
				let data = "";
				res2.on('data', (chunk) => {
					data += chunk;
				});
				res2.on('end', () => {
					try {
						loggerInfo.info("oneStepInsurance4mazui , data : " + data);
						var json = {};
						json = JSON.parse(data);
						if ("-9" == json.ret ) {
							let errorJson = {};
							errorJson.msg = json.msg;
							res.render("errorCenter", errorJson);
							return false;
						}
						//必须只有一种情况
						let maxLength = 0;
						for(let index in  json.data.priceJson){
							maxLength ++;
							json.price = json.data.priceJson[index].price;
							json.allDimensionCombine = index ;
							if(maxLength > 1){
								break;
							}
						}
						if(maxLength > 1){
							let errorJson = {};
							errorJson.msg = "该产品费用不唯一，请联系管理员！";
							res.render("errorCenter", errorJson);
							return false;
						}

						let uniqueTempData = uniqueCode+"tempData";
						req.session[uniqueTempData] =  JSON.parse(data);

						json.planCode = req.body.planCode;
						json.planGroupCode = req.body.planGroupCode;
						json.productCode = req.body.productCode;
						json.canShare = true;

						let uniquePlanData = uniqueCode+"planData";
						req.session[uniquePlanData] = {};
						req.session[uniquePlanData].telephone = json.data.telephone;
						req.session[uniquePlanData].effectiveIntervalType = json.data.effectiveIntervalType;
						req.session[uniquePlanData].effectiveInterval = json.data.effectiveInterval;
						req.session[uniquePlanData].effectiveIntervalFix = json.data.effectiveIntervalFix;

						if(json.data.shareInfo){
							req.session[uniqueShareCode].shareTitle = json.data.shareInfo.shareTitle? json.data.shareInfo.shareTitle : req.session[uniqueShareCode].shareTitle;
							req.session[uniqueShareCode].shareContent = json.data.shareInfo.shareContent? json.data.shareInfo.shareContent : req.session[uniqueShareCode].shareContent;
							req.session[uniqueShareCode].shareImg = json.data.shareInfo.shareImg? json.data.shareInfo.shareImg : req.session[uniqueShareCode].shareImg;
						}

						let finalJson = wxTool.getWxSignature(
							req,
							jsapiTicket,
							req.session[uniqueShareCode].shareUrl ,
							req.session[uniqueShareCode].shareTitle,
							req.session[uniqueShareCode].shareContent,
							req.session[uniqueShareCode].shareImg );

						json.wxJson = finalJson;
						json.uniqueCode = cryptoTool.getEncAse192(uniqueCode, cryptoConf.privateKey);

						res.render('fillPolicyInfo4mazui', json);
						resolve("ok");

					}
					catch (e) {
						loggerError.error("index  :" + e.message);
						resolve("ok");
					}
				});
			});
		});
	});
});


router.all('/oneStepInsurance', function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	if ((!req.body.salemanCode && !req.body.channelOperator ) || !req.body.planCode || !req.body.planGroupCode || !req.body.entCode) {
		let errorJson = {};
		errorJson.msg = "缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter", errorJson);
		return false;
	} else {
		req.session.shareUrl = req.protocol+"://"+req.headers.host+req.originalUrl;
		req.session.shareTitle = "分享";
		req.session.shareContent = "分享";
		req.session.shareImg = "";
		req.session.finalData = {};
		req.session.finalData.channelOperator = req.body.channelOperator;
		req.session.finalData.salemanCode = req.body.salemanCode;
		req.session.finalData.productCode = req.body.productCode;
		req.session.finalData.planCode = req.body.planCode;
		req.session.finalData.entCode = req.body.entCode;
		req.session.finalData.planGroupCode = req.body.planGroupCode;
	}
	co(function* () {
		let jsapiTicket = yield new Promise((resolve, reject) => {
			wxTool.getJsapiTicketOneStep(resolve);
		});
		yield new Promise((resolve, reject) =>{
			req.body.url = "apiPlan/genPlanDetail";
			httpTool(req, (res2) => {
				res2.setEncoding('utf8');
				// 响应体过大 自己拆分
				let data = "";
				res2.on('data', (chunk) => {
					data += chunk;
				});
				res2.on('end', () => {
					try {
						var json = {};
						json = JSON.parse(data);
						if ("-7" == json.ret || "-8" == json.ret) {
							let errorJson = {};
							errorJson.msg = json.msg;
							res.render("errorCenter", errorJson);
							return false;
						}
						//必须只有一种情况
						let maxLength = 0;
						for(let index in  json.data.priceJson){
							maxLength ++;
							json.price = json.data.priceJson[index].price;
							json.allDimensionCombine = index ;
							if(maxLength > 1){
								break;
							}
						}
						if(maxLength > 1){
							let errorJson = {};
							errorJson.msg = "该产品费用不唯一，请联系管理员！";
							res.render("errorCenter", errorJson);
							return false;
						}
						json.planCode = req.body.planCode;
						json.planGroupCode = req.body.planGroupCode;
						json.productCode = req.body.productCode;
						json.canShare = true;

						req.session.plan = {};
						req.session.plan.telephone = json.data.telephone;
						if (json.data.effectiveInterval && json.data.effectiveIntervalType) {
							req.session.plan.effectiveIntervalType = json.data.effectiveIntervalType;
							req.session.plan.effectiveInterval = json.data.effectiveInterval;
							req.session.plan.effectiveIntervalFix = json.data.effectiveIntervalFix;
						}
						let finalJson = wxTool.getWxSignature(req,jsapiTicket,null,json.data.shareInfo?json.data.shareInfo.shareTitle:null,json.data.shareInfo?json.data.shareInfo.shareContent:null,json.data.shareInfo?json.data.shareInfo.shareImg:null);
						json.wxJson = finalJson;
						loggerInfo.info("index , data : " + data);

						res.render('fillPolicyInfo2', json);
						resolve("ok");

					}
					catch (e) {
						loggerError.error("index  :" + e.message);
						resolve("ok");
					}
				});
			});
		});
	});
});

module.exports = router;
