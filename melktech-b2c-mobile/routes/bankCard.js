var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var co = require("co");
var redisTool = require("../tool/redisTool");
var redsiConf = require("../config/redisConf");
var httpTool = require('../tool/httpTool');

router.all("/bankCard",function(req,res,next){
	let json = {};
	let finalJson = {};
	co(function* () {
		json = yield new Promise((resolve, reject) => {
			redisTool.hgetall(redsiConf.redisPrefix + "bankNameZh", function (error, response) {
				let redisReturnJson ={};
				if(!error){
					redisReturnJson = response?response :{};
				}else{
					loggerError.error(error);
				}
				resolve(redisReturnJson);
			});
		});
		finalJson = yield new Promise((resolve, reject) => {
			let haveValue = false;
			let bankNameJsonArray = [];
			if(json){
				for(var key in json){
					haveValue = true;
					bankNameJson = {};
					bankNameJson.id = key;
					bankNameJson.value = json[key];
					bankNameJsonArray.push(bankNameJson);
				}
			}
			if(haveValue){
				resolve({"bankNameJsonArray" : bankNameJsonArray});
			}else{
				req.body.url = "apiOther/getBankNameZhList";
				httpTool(req, (res2) => {
					res2.setEncoding('utf8');
					// 响应体过大 自己拆分
					let data = "";
					res2.on('data', (chunk) => {
						data += chunk;
					});
					res2.on('end', () => {
						try {
							let jsonData = JSON.parse(data);
							if (jsonData.ret == 0) { //成功
								delete  jsonData.ret;
								delete  jsonData.msg;
								for(var key in jsonData){
									let bankNameJson = {};
									bankNameJson.id = key;
									bankNameJson.value = jsonData[key];
									bankNameJsonArray.push(bankNameJson);
									redisTool.hset(redsiConf.redisPrefix + "bankNameZh", key , jsonData[key] ,function (error,response) {});
								}
							}
							resolve({"bankNameJsonArray" : bankNameJsonArray});
						}
						catch (e) {
							loggerError.error("getBankNameZhList  :" + e.message);
							let errorJson = {};
							errorJson.msg = "获取银行卡失败";
							res.render("errorCenter", errorJson);
							resolve({});
						}
					});
				});
			}
		});
		yield new Promise((resolve, reject) => {
			req.body.id = req.session.saleman.id;
			req.body.url = "apiOther/getBankList";
			httpTool(req, (res2) => {
				res2.setEncoding('utf8');
				// 响应体过大 自己拆分
				let data = "";
				res2.on('data', (chunk) => {
					data += chunk;
				});
				res2.on('end', () => {
					try {
						let jsonData = JSON.parse(data);
						finalJson.data = jsonData;
						res.render("bankCard" , finalJson);
						resolve("ok");
					}
					catch (e) {
						loggerError.error("getBankList  :" + e.message);
						let errorJson = {};
						errorJson.msg = "获取银行卡失败";
						res.render("errorCenter", errorJson);
						resolve("ok");
					}
				});
			});

		});
	});

});

router.all("/updateBankInfo", multipartMiddleware ,function (req, res, next) {
	req.body.salemanId =  req.session.saleman.id;
	req.body.url = "apiOther/updateBankInfo";
	httpTool(req, (res2) => {
		res2.setEncoding('utf8');
		// 响应体过大 自己拆分
		let data = "";
		res2.on('data', (chunk) => {
			data += chunk;
		});
		res2.on('end', () => {
			try {
				let jsonData = JSON.parse(data);

				res.send(data);
			}
			catch (e) {
				loggerError.error("updateBankInfo  :" + e.message);
			}
		});
	});
});
module.exports = router;
