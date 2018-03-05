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
//保障管理页面
router.all("/SafeguardList",(req, res, next) => {
    let json = {};
    res.render("SafeguardManagement/SafeguardList",json);
});
//获取保障管理列表
router.post("/getPolicyList", multipartMiddleware, (req, res, next) => {
    req.body.url = "policy/policyList";
    req.body.userId = req.session.user.userId;
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                loggerInfo.info("getPolicyList , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("getPolicyList : " + e.message);
            }
        });
    });
});
//历史保障管理
router.all("/historicalSafeguardList",(req, res, next) =>{
    let json = {};
    res.render("SafeguardManagement/HistoricalSafeguardList",json);
});
//保障管理详情
router.post("/detailInfoList",(req ,res, next) =>{
    req.body.url = "policy/getPolicyInfo";
    req.body.userId = req.session.user.userId;
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                loggerInfo.info("detailInfoList , data : " + data);
                var json = JSON.parse(data);
                if(json.ret == "0"){
                    res.render("SafeguardManagement/DetailInfoList",json);
                }else{
                    return res.redirect(startPort.projectUrl);
                }
            }
            catch (e) {
                loggerError.error("detailInfoList : " + e.message);
            }
        });
    });
});
//保障管理的 常见问题
router.post('/policyGetPlanQuestionAnswer',(req ,res, next) =>{
    req.body.url = "policy/getPlanQuestionAnswer";
    req.body.userId = req.session.user.userId;
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                loggerInfo.info("policyGetPlanQuestionAnswer , data : " + data);
                var json = JSON.parse(data);
                if(json.ret == "0"){
                    res.render("SafeguardManagement/CommonProblem",json);
                }else{
                    return res.redirect(startPort.projectUrl);
                }
            }
            catch (e) {
                loggerError.error("policyGetPlanQuestionAnswer : " + e.message);
            }
        });
    });
});
module.exports = router;