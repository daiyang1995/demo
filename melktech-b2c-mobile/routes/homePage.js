var express = require('express');
var router = express.Router();

let cryptoTool = require('../tool/crypto');

let cryptoConf = require('../config/cryptoConf');
var co = require('co');


router.all('/index', function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query

	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);
	let uniqueTempData = uniqueCode+"tempData";

	if(req.session[uniqueTempData]){
		let json = req.session[uniqueTempData];
		json.uniqueCode = req.body.uniqueCode;
		res.render('index2', json);
	}else{
		let errorJson = {};
		errorJson.msg = "缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter", errorJson);
		return false;
	}
});

router.all("/insuranceProcess", function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);
	let uniqueTempData = uniqueCode+"tempData";
	if(req.session[uniqueTempData]){
		let json = {};
		json.uniqueCode = req.body.uniqueCode;
		res.render("insuranceProcess", json);
	}else{
		let errorJson = {};
		errorJson.msg = "缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter", errorJson);
		return false;
	}
});
router.all("/insuranceClauses", function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);
	let uniqueTempData = uniqueCode+"tempData";
	if(req.session[uniqueTempData]){
		let json = req.session[uniqueTempData];
		json.uniqueCode = req.body.uniqueCode;
		res.render('insuranceClauses', json);
	}else{
		let errorJson = {};
		errorJson.msg = "缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter", errorJson);
		return false;
	}
});
router.all("/claimProcess", function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);
	let uniqueTempData = uniqueCode+"tempData";
	if(req.session[uniqueTempData]){
		let json = {};
		json.uniqueCode = req.body.uniqueCode;
		res.render("claimProcess", json);
	}else{
		let errorJson = {};
		errorJson.msg = "缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter", errorJson);
		return false;
	}
});
router.all("/policyStatement", function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);
	let uniqueTempData = uniqueCode+"tempData";
	if(req.session[uniqueTempData]){
		let json = req.session[uniqueTempData];
		json.uniqueCode = req.body.uniqueCode;
		res.render('policyStatement', json);
	}else{
		let errorJson = {};
		errorJson.msg = "缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter", errorJson);
		return false;
	}
});

router.all("/insurancePolicy", function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);
	let uniqueTempData = uniqueCode+"tempData";
	if(req.session[uniqueTempData]){
		let json = req.session[uniqueTempData];
		json.uniqueCode = req.body.uniqueCode;
		res.render('insurancePolicy', json);
	}else{
		let errorJson = {};
		errorJson.msg = "缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter", errorJson);
		return false;
	}
});

router.all("/insuranceDeclaration", function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);
	let uniqueTempData = uniqueCode+"tempData";
	if(req.session[uniqueTempData]){
		let json = req.session[uniqueTempData];
		json.uniqueCode = req.body.uniqueCode;
		res.render('insuranceDeclaration', json);
	}else{
		let errorJson = {};
		errorJson.msg = "缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter", errorJson);
		return false;
	}
});

router.all("/fillPolicyInfo", function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);
	let uniquePlanData = uniqueCode+"planData";
	let json = {};
	json.effectiveIntervalType = req.session[uniquePlanData].effectiveIntervalType;
	json.effectiveInterval = req.session[uniquePlanData].effectiveInterval;
	json.effectiveIntervalFix = req.session[uniquePlanData].effectiveIntervalFix;
	json.telephone = req.session[uniquePlanData].telephone;
	json.planCode = req.body.planCode;
	json.planGroupCode = req.body.planGroupCode;
	json.productCode = req.body.productCode;
	json.uniqueCode = req.body.uniqueCode;

	res.render("fillPolicyInfo", json);
});

router.all("/fillPolicyInfo4gja", function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);
	let uniquePlanData = uniqueCode+"planData";
	let json = {};
	json.effectiveIntervalType = req.session[uniquePlanData].effectiveIntervalType;
	json.effectiveInterval = req.session[uniquePlanData].effectiveInterval;
	json.effectiveIntervalFix = req.session[uniquePlanData].effectiveIntervalFix;
	json.telephone = req.session[uniquePlanData].telephone;
	json.planCode = req.body.planCode;
	json.planGroupCode = req.body.planGroupCode;
	json.productCode = req.body.productCode;
	json.uniqueCode = req.body.uniqueCode;
	res.render("fillPolicyInfo4gja", json);
});

router.all('/goToHealthInfo', function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let uniqueCode = cryptoTool.getDecAse192(req.body.uniqueCode , cryptoConf.privateKey);
	let uniqueTempData = uniqueCode+"tempData";

	if(req.session[uniqueTempData]){
		req.body.allDimensionCombine ? req.session[uniqueCode].allDimensionCombine = req.body.allDimensionCombine :"";
		req.body.assa ? req.session[uniqueCode].assa = req.body.assa :"";
		req.body.price ? req.session[uniqueCode].price = req.body.price :"";
		let json = req.session[uniqueTempData];
		json.uniqueCode = req.body.uniqueCode;
		res.render('healthInfo', json);
	}else{
		let errorJson = {};
		errorJson.msg = "缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter", errorJson);
		return false;
	}
});

router.all('/goFinishPage', function (req, res, next) {
	let json = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	res.render("finish", json);
});

module.exports = router;
