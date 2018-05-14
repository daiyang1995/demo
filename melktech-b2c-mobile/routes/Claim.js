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

//全部赔案
router.all("/AllClaim",(req, res, next) => {
    let json = {};
    res.render("Claim/AllClaim",json);
});
//赔案列表
router.post("/entClaimApplyList", multipartMiddleware, (req, res) => {
    req.body.url = "entClaimApply/entClaimApplyList";
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
                loggerInfo.info("entClaimApplyList , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("entClaimApplyList : " + e.message);
            }
        });
    });
});
//赔案详情 post
router.all("/getEntClaimApplyInfo",(req, res) => {
    req.body.url = "entClaimApply/getEntClaimApplyInfo";
    if(req.method == "GET")
        req.body.jumpType = "true";
    else
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
                loggerInfo.info("getEntClaimApplyInfo , data : " + data);
                var json = JSON.parse(data);
                if(json.ret == "0"){
                    if(req.method == "GET"){
                        var user ={
                            userId : json.userId,
                            openId : json.openId
                        };
                        req.session.user = user;
                    }
                    res.render("Claim/ClaimDetail",json);
                }else{
                    return res.redirect(startPort.projectUrl);
                }
            }
            catch (e) {
                loggerError.error("getEntClaimApplyInfo : " + e.message);
            }
        });
    });
});

//赔案 常见问题
router.post('/ClaimGetPlanQuestionAnswer',(req ,res, next) =>{
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
                loggerInfo.info("ClaimGetPlanQuestionAnswer , data : " + data);
                var json = JSON.parse(data);
                if(json.ret == "0"){
                    json.localurl =   req.protocol+"://"+req.headers.host;
                    json.projectUrl = startPort.projectUrl;
                    res.render("Claim/CommonProblem",json);
                }else{
                    return res.redirect(startPort.projectUrl);
                }
            }
            catch (e) {
                loggerError.error("ClaimGetPlanQuestionAnswer : " + e.message);
            }
        });
    });
});
module.exports = router;