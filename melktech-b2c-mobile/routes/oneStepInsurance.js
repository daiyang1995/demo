var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var httpTool = require('../tool/httpTool');
var redisTool = require('../tool/redisTool');
var redisConf = require('../config/redisConf');
var wxTool = require('../tool/wxTool');
var co = require('co');

router.all('/oneStepInsurance4mazui', function (req, res, next) {
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
		req.session.finalData.planCode = req.body.planCode;
		req.session.finalData.entCode = req.body.entCode;
		req.session.finalData.planGroupCode = req.body.planGroupCode;
	}
	co(function* () {
		let jsapiTicket = yield new Promise((resolve, reject) => {
			redisTool.get(redisConf.redisPrefixBase + "jsapiTicket", function (error, response) {
				if (!error && response) {
					resolve(response);
				} else { //jsapiTicket 不存在
					loggerInfo.info("redisKey -> " + redisConf.redisPrefixBase + "jsapiTicket 不存在，重新获取");
					resolve("");
				}
			});
		});
		if (!jsapiTicket || jsapiTicket == "") { // 如果jsapiTicket 不存在
			let accessToken = yield new Promise((resolve, reject) => {
				redisTool.get(redisConf.redisPrefixBase + "accessToken", function (error, response) {
					if (!error && response) {
						resolve(response);
					} else { //accessToken不存在
						loggerInfo.info("redisKey -> " + redisConf.redisPrefixBase + "accessToken 不存在，重新获取");
						wxTool.getAccessToken(function (res2) {
							let data = '';
							res2.on('data', (chunk) => {
								data += chunk;
							});
							res2.on('end', function () {
								try {
									//获取到的数据
									loggerInfo.info("获取access_token : " + data);
									let json = JSON.parse(data);
									if(json.access_token){
										redisTool.set(redisConf.redisPrefixBase + "accessToken", json.access_token, function (e1, e2) {
											if (!e1) {
												redisTool.expire(redisConf.redisPrefixBase + "accessToken", 7200, function (e2, r2) {
													loggerInfo.info("access_token : " + json.access_token + "设置时间为7200S");
												});
											}
										});
										resolve(json.access_token);
									}else{
										resolve("");
									}
								} catch (e) {
									loggerError.info("获取accessToken失败");
									resolve("");
								}
							});
						});
					}
				});
			});
			jsapiTicket = yield new Promise((resolve, reject) => {
				if (!accessToken || accessToken == "") {
					let errorJson = {};
					loggerError.error("获取accessToken失败,accessToken为空");
					resolve("");
					// errorJson.msg = "获取accessToken失败";
					// res.render("errorCenter", errorJson);
					// return false;
				} else {
					wxTool.getJsapiTicketo(accessToken, function (res2) {
						let data = '';
						res2.on('data', (chunk) => {
							data += chunk;
						});
						res2.on('end', function () {
							try {
								//获取到的数据
								loggerInfo.info("获取jsapiTicket : " + data);
								let json = JSON.parse(data);
								redisTool.set(redisConf.redisPrefixBase + "jsapiTicket", json.ticket, function (e1, e2) {
									if (!e1) {
										redisTool.expire(redisConf.redisPrefixBase + "jsapiTicket", 7200, function (e2, r2) {
											loggerInfo.info("jsapiTicket : " + json.ticket + "设置时间为7200S");
										});
									}
								});
								resolve(json.ticket);
							} catch (e) {
								loggerError.error("获取jsapiTicket失败");
								// let errorJson = {};
								// errorJson.msg = "获取jsapiTicket失败";
								// res.render("errorCenter", errorJson);
								// return false;
								resolve("");
							}
						});
					});
				}
			});
		}
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
						json.canShare = true;

						req.session.plan = {};
						req.session.plan.telephone = json.data.telephone;
						if (json.data.effectiveInterval) {
							req.session.plan.effectiveInterval = json.data.effectiveInterval;
						}
						let finalJson = wxTool.getWxSignature(req,jsapiTicket,null,json.data.shareInfo?json.data.shareInfo.shareTitle:null,json.data.shareInfo?json.data.shareInfo.shareContent:null,json.data.shareInfo?json.data.shareInfo.shareImg:null);
						json.wxJson = finalJson;
						loggerInfo.info("index , data : " + data);

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
		req.session.finalData.planCode = req.body.planCode;
		req.session.finalData.entCode = req.body.entCode;
		req.session.finalData.planGroupCode = req.body.planGroupCode;
	}
	co(function* () {
		let jsapiTicket = yield new Promise((resolve, reject) => {
			redisTool.get(redisConf.redisPrefixBase + "jsapiTicket", function (error, response) {
				if (!error && response) {
					resolve(response);
				} else { //jsapiTicket 不存在
					loggerInfo.info("redisKey -> " + redisConf.redisPrefixBase + "jsapiTicket 不存在，重新获取");
					resolve("");
				}
			});
		});
		if (!jsapiTicket || jsapiTicket == "") { // 如果jsapiTicket 不存在
			let accessToken = yield new Promise((resolve, reject) => {
				redisTool.get(redisConf.redisPrefixBase + "accessToken", function (error, response) {
					if (!error && response) {
						resolve(response);
					} else { //accessToken不存在
						loggerInfo.info("redisKey -> " + redisConf.redisPrefixBase + "accessToken 不存在，重新获取");
						wxTool.getAccessToken(function (res2) {
							let data = '';
							res2.on('data', (chunk) => {
								data += chunk;
							});
							res2.on('end', function () {
								try {
									//获取到的数据
									loggerInfo.info("获取access_token : " + data);
									let json = JSON.parse(data);
									if(json.access_token){
										redisTool.set(redisConf.redisPrefixBase + "accessToken", json.access_token, function (e1, e2) {
											if (!e1) {
												redisTool.expire(redisConf.redisPrefixBase + "accessToken", 7200, function (e2, r2) {
													loggerInfo.info("access_token : " + json.access_token + "设置时间为7200S");
												});
											}
										});
										resolve(json.access_token);
									}else{
										resolve("");
									}
								} catch (e) {
									loggerError.info("获取accessToken失败");
									resolve("");
								}
							});
						});
					}
				});
			});
			jsapiTicket = yield new Promise((resolve, reject) => {
				if (!accessToken || accessToken == "") {
					let errorJson = {};
					loggerError.error("获取accessToken失败,accessToken为空");
					resolve("");
					// errorJson.msg = "获取accessToken失败";
					// res.render("errorCenter", errorJson);
					// return false;
				} else {
					wxTool.getJsapiTicketo(accessToken, function (res2) {
						let data = '';
						res2.on('data', (chunk) => {
							data += chunk;
						});
						res2.on('end', function () {
							try {
								//获取到的数据
								loggerInfo.info("获取jsapiTicket : " + data);
								let json = JSON.parse(data);
								redisTool.set(redisConf.redisPrefixBase + "jsapiTicket", json.ticket, function (e1, e2) {
									if (!e1) {
										redisTool.expire(redisConf.redisPrefixBase + "jsapiTicket", 7200, function (e2, r2) {
											loggerInfo.info("jsapiTicket : " + json.ticket + "设置时间为7200S");
										});
									}
								});
								resolve(json.ticket);
							} catch (e) {
								loggerError.error("获取jsapiTicket失败");
								// let errorJson = {};
								// errorJson.msg = "获取jsapiTicket失败";
								// res.render("errorCenter", errorJson);
								// return false;
								resolve("");
							}
						});
					});
				}
			});
		}
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
						json.canShare = true;

						req.session.plan = {};
						req.session.plan.telephone = json.data.telephone;
						if (json.data.effectiveInterval && json.data.effectiveIntervalType) {
							req.session.plan.effectiveIntervalType = json.data.effectiveIntervalType;
							req.session.plan.effectiveInterval = json.data.effectiveInterval;
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
