var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");
var startPort = require('../config/startPort');
var httpTool = require('../tool/httpTool');
var redisTool = require('../tool/redisTool');
var redisConf = require('../config/redisConf');

router.all("/register",function(req,res,next){
	/* 获取url上的参数 inviteCode 并置入邀请码中 */
	// if(req.headers.host.indexOf("pds.melktech.com") > -1){
	// 	loggerInfo.info("mk")
	// }else {
	// 	loggerInfo.info("bk");
	// }
	if(req.query.inviteCode){
		req.session.inviteCode = req.query.inviteCode;
	}
	res.redirect("registerPage")
	// json.inviteCode = "";
	// if(req.query.inviteCode){
	// 	json.inviteCode = req.query.inviteCode;
	// }
	// res.render("register" , json);
});

router.all("/registerPage",function(req,res,next){

	if(req.session.inviteCode){
		let json = {};
		json.inviteCode = req.session.inviteCode;
		res.render("register" , json);
		return false;
	}else{
		let errorJson = {};
		errorJson.msg = "对不起，禁止公开注册。请扫描二维码注册";
		res.render("errorCenter", errorJson);
		return false;
	}
});

router.post('/registerSubmit',  multipartMiddleware ,function(req, res, next) {
	// if(req.headers.host.indexOf("pds.melktech.com") > -1){
		req.body.entCode = "mk";
	// }else{
	// 	req.body.entCode = "bk";
	// }
	if(!req.session.inviteCode){
		let errorJson = {};
		errorJson.msg = "二维码已过期，请重新扫描二维码";
		res.render("errorCenter", errorJson);
	}
	req.body.inviteCode = req.session.inviteCode;
	req.body.url = "apiRegister/register";
	req.body.registerPageUrl = req.protocol+"://"+req.headers.host + startPort.projectUrl+"register";
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
				if(0 == loginJson.ret){
					delete  req.session.inviteCode;
					req.session.saleman = loginJson.saleman;
					redisTool.hset(redisConf.redisPrefix + loginJson.saleman.inviteCode , "qrCode" , loginJson.saleman.qrCode ,function (error , response) {
						if(error){
							loggerError.error("id为"+loginJson.id+"邀请码为"+loginJson.inviteCode+"的邀请二维码放入redis中失败");
						}else{
							loggerInfo.info("id为"+loginJson.id+"邀请码为"+loginJson.inviteCode+"的邀请二维码放入redis中成功");
						}
					});
					redisTool.hset(redisConf.redisPrefix + loginJson.saleman.inviteCode , "portrait" , loginJson.saleman.portrait ,function (error , response) {
						if(error){
							loggerError.error("id为"+loginJson.id+"邀请码为"+loginJson.inviteCode+"的头像放入redis中失败");
						}else{
							loggerInfo.info("id为"+loginJson.id+"邀请码为"+loginJson.inviteCode+"的头像放入redis中成功");
						}
					});
					redisTool.hset(redisConf.redisPrefix + loginJson.saleman.inviteCode , "mobile" , loginJson.saleman.mobile ,function (error , response) {
						if(error){
							loggerError.error("id为"+loginJson.id+"邀请码为"+loginJson.inviteCode+"的手机号放入redis中失败");
						}else{
							loggerInfo.info("id为"+loginJson.id+"邀请码为"+loginJson.inviteCode+"的手机号放入redis中成功");
						}
					});
				}
				res.send(data);
			}
			catch (e) {
				loggerError.error("registerSubmit  :" + e.message);
			}
		});
	});
});


module.exports = router;
