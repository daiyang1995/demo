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

router.all("/invite" , function (req, res, next) {
	let json = {};
	json.inviteCode = req.query.inviteCode;
	// if(req.session.saleman &&  req.session.saleman.inviteCode == json.inviteCode){
	// 	json.qrCode = req.session.saleman.qrCode;
	// 	json.mobile = req.session.saleman.mobile;
	// 	json.portrait = req.session.saleman.portrait;
	// 	json.canBack = true;
	// 	res.render("invite" , json);
	// 	return false;
	// }
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
		json = yield new Promise((resolve, reject) => {
			let qrCodeMark = false, portraitUrlMark = false , mobileMark = false;
			redisTool.hget(redisConf.redisPrefix  + json.inviteCode , "qrCode" , function (error ,response) {
				if(error){
					loggerError.error("邀请码为" + json.inviteCode +"的邀请二维码从redis中取出失败");
				}else{
					json.qrCode = response;
				}
				qrCodeMark = true;
				if(qrCodeMark && portraitUrlMark && mobileMark){
					resolve(json);
				}
			});
			redisTool.hget(redisConf.redisPrefix  + json.inviteCode , "portrait" , function (error ,response) {
				if(error){
					loggerError.error("邀请码为" + json.inviteCode +"的头像从redis中取出失败");
				}else{
					json.portrait = response;
				}
				portraitUrlMark = true;
				if(qrCodeMark && portraitUrlMark && mobileMark){
					resolve(json);
				}
			});
			redisTool.hget(redisConf.redisPrefix  + json.inviteCode , "mobile" , function (error ,response) {
				if(error){
					loggerError.error("邀请码为" + json.inviteCode +"的手机号从redis中取出失败");
				}else{
					json.mobile = response;
				}
				mobileMark = true;
				if(qrCodeMark && portraitUrlMark && mobileMark){
					resolve(json);
				}
			});
		});
		yield new Promise((resolve, reject) => {
			json.canBack = false;
			if(json.qrCode && json.mobile && json.portrait){
				let finalJson = wxTool.getWxSignature(req,jsapiTicket,null,"邀请","快来加入我们",json.qrCode);
				json.wxJson = finalJson;
				res.render("invite" , json);
				resolve("ok");
				return false;
			}else{
				// 再次获取qrCode,mobile,portrait;
				req.body.url = "apiOther/getInfoByInviteCode";
				req.body.inviteCode = json.inviteCode;

				httpTool(req, (res2) => {
					res2.setEncoding('utf8');
					// 响应体过大 自己拆分
					let body = "";
					res2.on('data', (chunk) => {
						body += chunk;
					});
					res2.on('end', () => {
						try {
							var jsonReturn = JSON.parse(body);
							if(jsonReturn.ret == 0){
								json.qrCode = jsonReturn.qrCode;
								json.mobile = jsonReturn.mobile;
								json.portrait = jsonReturn.portrait;
								redisTool.hset(redisConf.redisPrefix + json.inviteCode , "qrCode" , json.qrCode ,function (error , response) {
									if(error){
										loggerError.error("邀请码为"+json.inviteCode+"的邀请二维码放入redis中失败");
									}else{
										loggerInfo.info("邀请码为"+json.inviteCode+"的邀请二维码放入redis中成功");
									}
								});
								redisTool.hset(redisConf.redisPrefix + json.inviteCode , "portrait" , json.portrait ,function (error , response) {
									if(error){
										loggerError.error("邀请码为"+json.inviteCode+"的头像放入redis中失败");
									}else{
										loggerInfo.info("邀请码为"+json.inviteCode+"的头像放入redis中成功");
									}
								});
								redisTool.hset(redisConf.redisPrefix + json.inviteCode , "mobile" , json.mobile ,function (error , response) {
									if(error){
										loggerError.error("邀请码为"+json.inviteCode+"的手机号放入redis中失败");
									}else{
										loggerInfo.info("邀请码为"+json.inviteCode+"的手机号放入redis中成功");
									}
								});

								let finalJson = wxTool.getWxSignature(req,jsapiTicket,null,"邀请","快来加入我们",json.qrCode);
								json.wxJson = finalJson;
								res.render("invite" , json);
								resolve(json);
							}else{
								loggerError.error("邀请码为"+json.inviteCode+"的信息获取失败");
								let errorJson = {};
								errorJson.msg = "该邀请码错误，未能获取到用户信息";
								res.render("errorCenter", errorJson);
								resolve(errorJson);
							}
						} catch (e) {
							loggerError.error("getQrCode : " + e.message);
							let errorJson = {};
							errorJson.msg = "系统异常，请联系管理员";
							res.render("errorCenter", errorJson);
							resolve("error");
						}
					});
				});
			}
		});
	});



});

module.exports = router;
