var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

/*var redisTool = require('../tool/redisTool');*/
var httpTool = require('../tool/httpTool');
var uploadTool = require('../tool/uploadTool');
/*var ajaxHttps = require('../tool/httpsTool');*/
var startPort = require('../config/startPort');
var co = require('co');
var fs = require("fs");

//地址添加
router.all('/AddrInformation', (req, res, next) => {
    let json = {};
    res.render('CommonInformation/AddrInformation',json);
});

router.all('/AddressInformation', (req, res, next) => {
    let json = {};
    res.render('CommonInformation/AddressInformation',json);
});

/*****************************************************************************/
//人员添加
router.all('/PersonAddInformation', (req, res, next) => {
    let json = {};
    res.render('CommonInformation/PersonAddInformation',json);
});
router.all('/PersonInformation', (req, res, next) => {
    let json = {};
    res.render('CommonInformation/PersonInformation',json);
});

//人员查询
router.post('/getUserList',multipartMiddleware, (req, res,next) => {
    req.body.url = "user/getUserList";
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
                loggerInfo.info("getUserList , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("getUserList : " + e.message);
            }
        });
    });
});
router.post('/GetPersonInformation', (req, res, next) => {
    req.body.url = "user/getUserInfo";
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
                loggerInfo.info("GetPersonInformation , data : " + data);
                var json = JSON.parse(data);
                if(json.ret == "0"){
                    res.render('CommonInformation/PersonInformationView',json);
                }else{
                    return res.redirect(startPort.projectUrl);
                }
            }
            catch (e) {
                loggerError.error("GetPersonInformation : " + e.message);
            }
        });
    });

});
/*****************************************************************************/
//银行卡添加
router.all('/AddBankInformation', (req, res, next) => {
    /* req.body.url = "/kp-student-api/apiAccount/bankList";
     ajaxHttp(req, (res2) => {
         res2.setEncoding('utf8');
         // 响应体过大 自己拆分
         let body = "";
         res2.on('data', (chunk) => {
             body += chunk;
         });
         res2.on('end', () => {
             try {
                 req.body.bankList = body;
                 res.render('CommonInformation/AddBankInformation', req.body);
             }
             catch (e) {
               loggerError.error("AddBankInformation : " + e.message);
             }
         });
     });*/
    let json = {};
    res.render('CommonInformation/AddBankInformation', json);
});
//银行卡信息查看
router.all('/CheckBankInformation', (req, res, next) => {
    req.body.url = "userBank/getUserBankInfo";
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
                loggerInfo.info("CheckBankInformation , data : " + data);
                var json = JSON.parse(data);
                if(json.ret == "0"){
                    res.render("CommonInformation/CheckBankInformation", json);
                }else{
                    return res.redirect(startPort.projectUrl);
                }
            }
            catch (e) {
                loggerError.error("CheckBankInformation : " + e.message);
            }
        });
    });
});
//银行卡删除
router.all('/DelBankInformation', multipartMiddleware, (req, res, next) => {
    req.body.url = "userBank/deleteUserBank";
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
                loggerInfo.info("DelBankInformation , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("DelBankInformation : " + e.message);
            }
        });
    });
});

//银行卡列表查询
router.post('/getUserBankList',multipartMiddleware, (req, res,next) => {
    req.body.url = "userBank/getUserBankList";
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
                loggerInfo.info("getUserBankList , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("getUserBankList : " + e.message);
            }
        });
    });
});
//银行卡保存
router.post('/saveUserBankInfo',multipartMiddleware, (req, res,next) => {
    req.body = uploadTool.uploadSingle(req);
    req.body.url = "userBank/saveUserBankInfo";
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
                loggerInfo.info("saveUserBankInfo , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("saveUserBankInfo : " + e.message);
            }
        });
    });
});
//银行卡图片识别
router.post('/getBankInfoByImage' , multipartMiddleware, (req, res,next) => {
    req.body = uploadTool.uploadSingle(req);
    if(req.body.ret){
        res.send(req.body);
        loggerInfo.info("getBankInfoByImage , "+req.body);
        return false;
    }
    req.body.url = "userBank/getBankInfoByImage";
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
                loggerInfo.info("getBankInfoByImage , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("getBankInfoByImage : " + e.message);
            }
        });
    });
});
router.all('/BankInformation', (req, res, next) => {
    let json = {};
    res.render('CommonInformation/BankInformation', json);
});
module.exports = router;