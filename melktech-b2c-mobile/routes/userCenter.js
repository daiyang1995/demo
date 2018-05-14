var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var uploadTool = require("../tool/uploadTool");
var redisTool = require('../tool/redisTool');
var redisConf = require('../config/redisConf');

var co = require('co');

var httpTool = require('../tool/httpTool');

router.all("/userCenter" ,function(req, res, next) {
	let json = {};
	json.mobile = req.session.saleman.mobile;
	json.inviteCode = req.session.saleman.inviteCode;
	json.portrait = req.session.saleman.portrait;
	json.canInvite = req.session.saleman.canInvite == 0 ? false : true;

	req.body.id =  req.session.saleman.id;
	req.body.url = "apiOther/financial";
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
				console.log(data);
				json = Object.assign(jsonData, json);
				res.render("userCenter" , json);
			}
			catch (e) {
				loggerError.error("financial  :" + e.message);
				let errorJson = {};
				errorJson.msg = "获取佣金失败";
				res.render("errorCenter", errorJson);
			}
		});
	});

});


//上传用户头像
router.post('/updatePortrait', (req, res, next) => {
	let json ={};
	co(function* () {
		let json = yield new Promise((resolve1, reject1) => {
			uploadTool.uploadSingleGZip(req ,resolve1, 100);
		});
		yield new Promise((resolve2, reject1) => {
			if (json.ret) {
				res.send(json);
				loggerInfo.info("updatePortrait , " + (JSON.stringify(json)));
				resolve2("ok");
				return false;
			}
			req.body.url = "apiOther/updatePortrait";
			req.body.id = req.session.saleman.id;
			req.body.portraitBase64 = json.imgBase64;

			httpTool(req, (res2) => {
				res2.setEncoding('utf8');
				// 响应体过大 自己拆分
				let body = "";
				res2.on('data', (chunk) => {
					body += chunk;
				});
				res2.on('end', () => {
					try {
						var json = JSON.parse(body);
						if(json.ret == 0){
							req.session.saleman.portrait = json.portrait;
							redisTool.hset(redisConf.redisPrefix + req.session.saleman.inviteCode , "portrait" , json.portrait ,function (error , response) {
								if(error){
									loggerError.error("id为"+req.session.saleman.id+"邀请码为"+req.session.saleman.inviteCode+"的头像放入redis中失败");
								}else{
									loggerInfo.info("id为"+req.session.saleman.id+"邀请码为"+req.session.saleman.inviteCode+"的头像放入redis中成功");
								}
							});
						}
						res.send(body);
						resolve2("ok");
					} catch (e) {
						loggerError.error("updatePortrait : " + e.message);
						resolve2("error");
					}
				});
			});
		});
	});


});

module.exports = router;
