var express = require('express');
var router = express.Router();

var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

// var redisTool = require('../tool/redisTool');
var httpTool = require('../tool/httpTool');
// var ajaxHttps = require('../tool/httpsTool');
var startPort = require('../config/startPort');


router.all("/pcError",(req, res, next) => {
    let json = {};
    json.msg = "必须使用手机端微信打开";
    res.render("pcError",json);
});
/* GET home page. */
router.all('/', (req, res, next) => {
    loggerInfo.info(req.query);
    if(req.session.user &&  req.session.user.openId !="" && req.session.user.userId !="" ){
        loggerInfo.info("这是从session 登陆缓存走的");
        req.body.openId = req.session.user.openId;
        req.body.userId = req.session.user.userId;
    }else{
        loggerInfo.info("这不是从session 登陆缓存走的");
        if(req.session.openId){
            req.body.openId = req.session.openId;
        }

        // //测试使用
        req.body.openId = "oW00nwWggzfXeJPTb0dN-xO9h-6A";
        req.body.userId = "3e1040bfa48047308b5927ecc3d199e8";
    }
    req.body.url = "Oauth/getUserInfo";
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                loggerInfo.info("body:"+data);
                var json = JSON.parse(data);
                if(json.ret == "0"){
                    req.session.openId = "";
                    req.session.userId = "";
                    var user ={
                        userName:json.user.userName,
                        userGender:json.user.userGender,
                        userHeadAppearUrl:json.user.userHeadAppearUrl,
                        userId : json.userId,
                        openId : json.openId
                    };
                    req.session.user = user;
                    json.user = user;
                    res.render('index', json);
                }else if(json.ret == "-1"){
                    req.session.openId = json.openId;
                    res.render("bindingPage", json);
                }else{
                    json.msg = "请求出错，请尝试重新从微信中打开";
                    res.render("pcError",json);
                }
            }
            catch (e) {
                loggerError.error(e.message);
                req.body.msg = "请求出错，请尝试重新从微信中打开";
                res.render('pcError', req.body);
            }
        });
    });
});

module.exports = router;
