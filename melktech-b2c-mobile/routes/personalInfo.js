var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var httpTool = require('../tool/httpTool');

router.all("/personalInfo",function(req,res,next){
	let json = {};
	json.name = req.session.saleman.name;
	json.identifyType = req.session.saleman.identifyType;
	json.identifyNumber = req.session.saleman.identifyNumber;
	json.email = req.session.saleman.email;
	if(req.session.saleman.gender == 0){
		json.gender = "女";
	}else if(req.session.saleman.gender == 1){
		json.gender = "男";
	}else{
		json.gender = null;
	}
	res.render("personalInfo",json);
});
router.post('/updatePersonalInfo',  multipartMiddleware ,function(req, res, next) {
	req.body.id =  req.session.saleman.id;
	req.body.url = "apiOther/updatePersonalInfo";
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
				if(jsonData.ret == 0 ){ //成功
					req.session.saleman.name = req.body.name;
					if(req.body.identifyType && req.body.identifyNumber){
						req.session.saleman.identifyType = req.body.identifyType;
						req.session.saleman.identifyNumber = req.body.identifyNumber;
						if(req.body.identifyType && req.body.identifyType == "身份证" ){
							req.session.saleman.idCard = req.body.identifyNumber;
						}else{
							req.session.saleman.passport = req.body.identifyNumber;
						}
					}
					req.session.saleman.email = req.body.email;
					req.session.saleman.gender = req.body.gender?(req.body.gender == "女" ? 0:1) :null;
				}
				res.send(data);
			}
			catch (e) {
				loggerError.error("getPolicyList  :" + e.message);
			}
		});
	});
});

module.exports = router;
