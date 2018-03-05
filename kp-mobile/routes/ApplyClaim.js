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
var uploadTool = require('../tool/uploadTool');
var startPort = require('../config/startPort');
var co = require('co');



router.post('/checkIsCanClaim' , multipartMiddleware , function (req, res ,next) {
    req.body.url = "entClaimApply/checkIsCanClaim";
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
                loggerInfo.info("checkIsCanClaim , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("checkIsCanClaim  :" + e.message);
            }
        });
    });
});

router.all('/ApplyClaimList' , function (req, res , next) {
    res.render("ApplyClaim/ApplyClaimList");
});

/* 航延险理赔 */
router.all("/ApplyPlaneClaimStep1" , function (req, res , next) {
    req.body.url = "entClaimApply/startEntClaimApplyStep1";
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
                loggerInfo.info("ApplyPlaneClaimStep1 , data : " + data);
                var json = JSON.parse(data);
                if(json.ret == "0"){
                    res.render("ApplyClaim/ApplyPlaneClaimStep1", json);
                }else{
                    return res.redirect(startPort.projectUrl);
                }

            }
            catch (e) {
                loggerError.error("ApplyPlaneClaimStep1  :" + e.message);
            }
        });
    });
});
router.post('/savePlaneClaimStep1',multipartMiddleware , function(req, res, next) {
    // req.body.url = "entClaimApply/saveStartEntClaimApplyStep1";
    // req.body.userId = req.session.user.userId;
    // httpTool(req, (res2) => {
    //     res2.setEncoding('utf8');
    //     // 响应体过大 自己拆分
    //     let data = "";
    //     res2.on('data', (chunk) => {
    //         data += chunk;
    //     });
    //     res2.on('end', () => {
    //         try {
    //             loggerInfo.info("saveMedicineClaimStep1 , data : " + data);
    var data={};
    data.msg = "成功";
    data.ret =0 ;
    res.send(data);
    //         }
    //         catch (e) {
    //             loggerError.error("saveMedicineClaimStep1  :" + e.message);
    //         }
    //     });
    // });
});
router.post("/uploadPlaneClaimFile" , multipartMiddleware , function (req, res , next) {
    let json = uploadTool.uploadSingle(req);
    if(json.ret && json.msg)
        res.render(json);
    json.ret = 0;
    json.msg = "成功";
    res.send(json);
});
router.all('/ApplyPlaneClaimStep2', function(req, res, next) {
    // req.body.url = "entClaimApply/startEntClaimApplyStep2";
    // req.body.userId = req.session.user.userId;
    let json = {};
    json.entClaimApplyId = 2;
    res.render("ApplyClaim/ApplyPlaneClaimStep2",json);
    // httpTool(req, (res2) => {
    //     res2.setEncoding('utf8');
    //     // 响应体过大 自己拆分
    //     let data = "";
    //     res2.on('data', (chunk) => {
    //         data += chunk;
    //     });
    //     res2.on('end', () => {
    //         try {
    //             loggerInfo.info("ApplyPlaneClaimStep2 , data : " + data);
    //             var json = JSON.parse(data);
    //             if(json.ret == "0"){
    //                 res.render("ApplyClaim/ApplyPlaneClaimStep2", json);
    //             }else{
    //                 return res.redirect(startPort.projectUrl);
    //             }
    //         }
    //         catch (e) {
    //             loggerError.error("ApplyPlaneClaimStep2  :" + e.message);
    //         }
    //     });
    // });
});

/* 医疗险理赔 */
router.all('/ApplyMedicineClaimStep1', function(req, res, next) {
    req.body.url = "entClaimApply/startEntClaimApplyStep1";
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
                loggerInfo.info("ApplyMedicineClaimStep1 , data : " + data);
                var json = JSON.parse(data);
                if(json.ret == "0"){
                    res.render("ApplyClaim/ApplyMedicineClaimStep1", json);
                }else{
                    return res.redirect(startPort.projectUrl);
                }

            }
            catch (e) {
                loggerError.error("ApplyMedicineClaimStep1  :" + e.message);
            }
        });
    });

});
router.post('/saveMedicineClaimStep1',multipartMiddleware , function(req, res, next) {
    req.body.url = "entClaimApply/saveStartEntClaimApplyStep1";
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
                loggerInfo.info("saveMedicineClaimStep1 , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("saveMedicineClaimStep1  :" + e.message);
            }
        });
    });
});
router.all('/ApplyMedicineClaimStep2', function(req, res, next) {
    req.body.url = "entClaimApply/startEntClaimApplyStep2";
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
                loggerInfo.info("ApplyMedicineClaimStep2 , data : " + data);
                var json = JSON.parse(data);
                if(json.ret == "0"){
                    res.render("ApplyClaim/ApplyMedicineClaimStep2", json);
                }else{
                    return res.redirect(startPort.projectUrl);
                }
            }
            catch (e) {
                loggerError.error("ApplyMedicineClaimStep2  :" + e.message);
            }
        });
    });
});
router.post('/saveMedicineClaimStep2',multipartMiddleware , function(req, res, next) {
    req.body.userId = req.session.user.userId;
    req.body.url = "entClaimApply/saveStartEntClaimApplyStep2";
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                loggerInfo.info("saveMedicineClaimStep2 , data : " + data);
                res.send(data)
            }
            catch (e) {
                loggerError.error("saveMedicineClaimStep2  :" + e.message);
            }
        });
    });
});
router.all('/ApplyMedicineClaimStep3', function(req, res, next) {
    req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
    var json =  req.body;
    res.render("ApplyClaim/ApplyMedicineClaimStep3", json);
});
router.post("/uploadMedicineClaimFile" , multipartMiddleware , function (req, res , next) {
    let json = uploadTool.uploadBatch(req);
    json.ret = 0;
    json.msg = "成功";
    res.send(json);
});
router.post("/getMedicineClaimTypeListByPolicyNo" , multipartMiddleware ,function (req, res , next) {
    req.body.url = "entClaimApply/getClaimTypeListByPolicyNo";
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
                loggerInfo.info("getMedicineClaimTypeListByPolicyNo , data : " + data);
                res.send(data);
            }
            catch (e) {
                loggerError.error("getMedicineClaimTypeListByPolicyNo  :" + e.message);
            }
        });
    });
});


module.exports = router;