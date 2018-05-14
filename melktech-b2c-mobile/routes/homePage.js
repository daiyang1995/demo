var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var httpTool = require('../tool/httpTool');
var co = require('co');


router.all('/index', function(req, res, next) {
    req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	req.body.planCode = req.session.finalData.planCode ;
	req.body.planGroupCode = req.session.finalData.planGroupCode ;
	req.body.url = "apiPlan/genPlanDetail";
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                var json = {};
                json = JSON.parse(data);
                json.planCode = req.body.planCode;
                if("-7" == json.ret || "-8" == json.ret){
					let errorJson = {};
					errorJson.msg= json.msg;
					res.render("errorCenter" , errorJson);
					return false;
                }
				req.session.plan = {};
				req.session.plan.telephone = json.data.telephone;
				if (json.data.effectiveInterval && json.data.effectiveIntervalType) {
					req.session.plan.effectiveIntervalType = json.data.effectiveIntervalType;
					req.session.plan.effectiveInterval = json.data.effectiveInterval;
				}
                loggerInfo.info("index , data : " + data);
                if(req.body.planCode == "1") {
					res.render('index', json);
				} else
                    res.render('index2',json);
            }
            catch (e) {
                loggerError.error("index  :" + e.message);
            }
        });
    });
});

router.all("/insuranceProcess" ,function (req, res ,next) {
    req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
    let json = {};
    if(!req.body.planCode){
        json.planCode = "1";
    }else{
        json.planCode = req.body.planCode;
    }
    res.render("insuranceProcess",json);
});
router.all("/insuranceClauses" ,function (req, res ,next) {
    req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
    req.body.url = "apiPlan/genPlanDetail";
    if(!req.body.planCode){
        req.body.planCode = "1";
    }
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                var json = {};
                json = JSON.parse(data);
                json.planCode = req.body.planCode;
                loggerInfo.info("insuranceClauses , data : " + data);
                res.render('insuranceClauses',json);
            }
            catch (e) {
                loggerError.error("insuranceClauses  :" + e.message);
            }
        });
    });
});
router.all("/claimProcess" ,function (req, res ,next) {
    req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
    let json = {};
    if(!req.body.planCode){
        json.planCode = "1";
    }else{
        json.planCode = req.body.planCode;
    }
    res.render("claimProcess",json);
});
router.all("/policyStatement" ,function (req, res ,next) {
    req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
    req.body.url = "apiPlan/genPlanDetail";
    if(!req.body.planCode){
        req.body.planCode = "1";
    }
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
				loggerInfo.info("policyStatement , data : " + data);
                var json = {};
                json = JSON.parse(data);
                json.planCode = req.body.planCode;
                res.render('policyStatement',json);
            }
            catch (e) {
                loggerError.error("policyStatement  :" + e.message);
            }
        });
    });
});

router.all("/insurancePolicy" ,function (req, res ,next) {
    req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
    req.body.url = "apiPlan/genPlanDetail";
    if(!req.body.planCode){
        req.body.planCode = "1";
    }
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                var json = {};
                json = JSON.parse(data);
                json.planCode = req.body.planCode;
                loggerInfo.info("insurancePolicy , data : " + data);
                res.render('insurancePolicy',json);
            }
            catch (e) {
                loggerError.error("insurancePolicy  :" + e.message);
            }
        });
    });
});

router.all("/insuranceDeclaration" ,function (req, res ,next) {
    req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
    req.body.url = "apiPlan/genPlanDetail";
    if(!req.body.planCode){
        req.body.planCode = "1";
    }
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                var json = {};
                json = JSON.parse(data);
                json.planCode = req.body.planCode;
                loggerInfo.info("insuranceDeclaration , data : " + data);
                res.render('insuranceDeclaration',json);
            }
            catch (e) {
                loggerError.error("insuranceDeclaration  :" + e.message);
            }
        });
    });
});


router.all("/fillPolicyInfo" ,function(req, res ,next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let json = {};
	if(!req.body.planCode){
		json.planCode = "1";
	}else{
		json.effectiveIntervalType = req.session.plan.effectiveIntervalType;
	    json.effectiveInterval = req.session.plan.effectiveInterval;
	    json.telephone = req.session.plan.telephone;
		json.planCode = req.body.planCode;
	}

	res.render("fillPolicyInfo",json);
});

router.all('/goToHealthInfo', function(req, res, next) {
    req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	req.session.finalData =  Object.assign(req.session.finalData, JSON.parse(JSON.stringify(req.body)));
	console.log(req.session.finalData );
    req.body.url = "apiPlan/genPlanDetail";
    if(!req.body.planCode){
        req.body.planCode = "1";
    }
    httpTool(req, (res2) => {
        res2.setEncoding('utf8');
        // 响应体过大 自己拆分
        let data = "";
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {
            try {
                var json = {};
                json = JSON.parse(data);
                json.planCode = req.body.planCode;
                loggerInfo.info("healthInfo , data : " + data);
                res.render('healthInfo',json);
            }
            catch (e) {
                loggerError.error("healthInfo  :" + e.message);
            }
        });
    });
});

router.all('/goFinishPage', function(req, res, next) {
	let json = Object.assign(req.body, req.query); //拼接 req.body 和req.query
    res.render("finish",json);
});

module.exports = router;
