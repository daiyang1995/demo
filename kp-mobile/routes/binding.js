var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

// var redisTool = require('../tool/redisTool');
var httpTool = require('../tool/httpTool');
// var ajaxHttps = require('../tool/httpsTool');
var startPort = require('../config/startPort');
var co = require('co');

router.all('/bindingPage', function(req, res, next) {
    let json = {};
    res.render("bindingPage", json);
});
//绑定按钮
router.post('/binding',multipartMiddleware, (req, res,next) => {
    req.body.url = "Binding/binding";
    var openId = req.session.openId;
    loggerInfo.info("openId : " +openId);
    req.body.openId = openId;
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                loggerInfo.info("binding , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("binding  :" + e.message);
            }
        });
    });
});
//ajax
router.post('/sendCode',multipartMiddleware,(req,res,next) =>{
    req.body.url = "Binding/sendCode";
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                loggerInfo.info("sendCode , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("sendCode : " + e.message);
            }
        });
    });
});

module.exports = router;