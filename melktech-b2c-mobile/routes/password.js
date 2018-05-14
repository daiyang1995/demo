var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var httpTool = require('../tool/httpTool');

router.all("/modifyPasswordPage",function(req,res,next){
	res.render("modifyPassword");
});
router.post('/modifyPassword',  multipartMiddleware ,function(req, res, next) {
	req.body.mobile =  req.session.saleman.mobile;
	req.body.url = "apiOther/modifyPassword";
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
				loggerError.error("modifyPassword  :" + e.message);
			}
		});
	});
});

module.exports = router;
