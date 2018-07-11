var express = require('express');
var router = express.Router();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");

router.all('/preCookieRedirect', (req, res, next) => {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	req.session.preCookie="";
	loggerInfo.info("预生成cookie,url:"+req.body.url);
	res.redirect(req.body.url);
});
router.all('/preCookiePage', (req, res, next) => {
	req.session.preCookie="";
	res.render("preCookiePage");
});
module.exports = router;
