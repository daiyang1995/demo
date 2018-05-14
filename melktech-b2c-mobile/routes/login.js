var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");
var redisTool = require('../tool/redisTool');
var redisConf = require('../config/redisConf');

var httpTool = require('../tool/httpTool');

router.all("/login",function(req,res,next){
	res.render("login");
});

router.post('/loginSubmit',  multipartMiddleware ,function(req, res, next) {
	req.body.entCode = "mk";
	req.body.url = "apiLogin/login";
	httpTool(req, (res2) => {
		res2.setEncoding('utf8');
		// 响应体过大 自己拆分
		let data = "";
		res2.on('data', (chunk) => {
			data += chunk;
		});
		res2.on('end', () => {
			try {
				let loginJson = JSON.parse(data);
				if(0 == loginJson.ret ){
					req.session.saleman = loginJson.saleman;
					redisTool.hset(redisConf.redisPrefix + loginJson.saleman.inviteCode , "qrCode" , loginJson.saleman.qrCode ,function (error , response) {
						if(error){
							loggerError.error("id为"+loginJson.saleman.id+"邀请码为"+loginJson.saleman.inviteCode+"的邀请二维码放入redis中失败");
						}else{
							loggerInfo.info("id为"+loginJson.saleman.id+"邀请码为"+loginJson.saleman.inviteCode+"的邀请二维码放入redis中成功");
						}
					});
					redisTool.hset(redisConf.redisPrefix + loginJson.saleman.inviteCode , "portrait" , loginJson.saleman.portrait ,function (error , response) {
						if(error){
							loggerError.error("id为"+loginJson.saleman.id+"邀请码为"+loginJson.saleman.inviteCode+"的头像放入redis中失败");
						}else{
							loggerInfo.info("id为"+loginJson.saleman.id+"邀请码为"+loginJson.saleman.inviteCode+"的头像放入redis中成功");
						}
					});
					redisTool.hset(redisConf.redisPrefix + loginJson.saleman.inviteCode , "mobile" , loginJson.saleman.mobile ,function (error , response) {
						if(error){
							loggerError.error("id为"+loginJson.saleman.id+"邀请码为"+loginJson.saleman.inviteCode+"的手机号放入redis中失败");
						}else{
							loggerInfo.info("id为"+loginJson.saleman.id+"邀请码为"+loginJson.saleman.inviteCode+"的手机号放入redis中成功");
						}
					});
				}
				res.send(data);
			}
			catch (e) {
				loggerError.error("loginSubmit  :" + e.message);
			}
		});
	});
});


module.exports = router;
