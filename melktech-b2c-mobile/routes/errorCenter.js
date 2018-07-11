var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var httpTool = require('../tool/httpTool');

router.all('/errorCenter' ,function(req, res, next) {
	res.render("errorCenter");
});

module.exports = router;