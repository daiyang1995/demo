let express = require('express');
let router = express.Router();

let log4js = require('log4js');
let loggerInfo = log4js.getLogger("default");
let loggerError = log4js.getLogger("error");

let httpTool = require('../tool/httpTool');
let wxTool = require('../tool/wxTool');
let cryptoTool = require('../tool/crypto');

let cryptoConf = require('../config/cryptoConf');

let co = require('co');

router.all('/', function (req, res, next) {
	req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
	let uniqueCode = "";
	let uniqueShareCode = uniqueCode+"wxshare";
	if ((!req.body.salemanCode && !req.body.channelOperator ) ||
		((!req.body.planCode || !req.body.planGroupCode) && !req.body.productCode) || !req.body.entCode  ) {
		loggerInfo.error(`
			req.body.salemanCode:${req.body.salemanCode},
			req.body.channelOperator:${req.body.channelOperator},
			req.body.planCode:${req.body.planCode },
			req.body.planGroupCode:${req.body.planGroupCode },
			req.body.entCode:${req.body.entCode },
			req.body.entCode:${req.body.productCode }
		`);
		let errorJson = {};
		errorJson.msg = "缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter", errorJson);
		return false;
	} else {
		uniqueCode = req.body.productCode ? req.body.productCode : req.body.planCode + "-" + req.body.planGroupCode;
		req.session[uniqueCode] = {};
		req.session[uniqueCode].channelOperator = req.body.channelOperator;
		req.session[uniqueCode].salemanCode = req.body.salemanCode;
		req.session[uniqueCode].productCode = req.body.productCode;
		req.session[uniqueCode].planCode = req.body.planCode;
		req.session[uniqueCode].entCode = req.body.entCode;
		req.session[uniqueCode].planGroupCode = req.body.planGroupCode;
		uniqueShareCode = uniqueCode+"wxshare";
		req.session[uniqueShareCode] = {};
		req.session[uniqueShareCode].shareUrl = req.protocol+"://"+req.headers.host+req.originalUrl;
		req.session[uniqueShareCode].shareTitle = "分享";
		req.session[uniqueShareCode].shareContent = "分享";
		req.session[uniqueShareCode].shareImg = "";
	}
	co(function* () {
		let jsapiTicket = yield new Promise((resolve, reject) => {
			wxTool.getJsapiTicketOneStep(resolve);
		});
		yield new Promise((resolve, reject) =>{
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
						let json = {};
						loggerInfo.info("index , data : " + data);
						json = JSON.parse(data);

						if ("-9" == json.ret ) {
							let errorJson = {};
							errorJson.msg = json.msg;
							res.render("errorCenter", errorJson);
							return false;
						}
						//放入临时的json
						let uniqueTempData = uniqueCode+"tempData";
						req.session[uniqueTempData] =  JSON.parse(data);

						json.canShare = true;

						let uniquePlanData = uniqueCode+"planData";

						req.session[uniquePlanData] = {};
						req.session[uniquePlanData].telephone = json.data.telephone;
						req.session[uniquePlanData].effectiveIntervalType = json.data.effectiveIntervalType;
						req.session[uniquePlanData].effectiveInterval = json.data.effectiveInterval;
						req.session[uniquePlanData].effectiveIntervalFix = json.data.effectiveIntervalFix;

						if(json.data.shareInfo){
							req.session[uniqueShareCode].shareTitle = json.data.shareInfo.shareTitle? json.data.shareInfo.shareTitle : req.session[uniqueShareCode].shareTitle;
							req.session[uniqueShareCode].shareContent = json.data.shareInfo.shareContent? json.data.shareInfo.shareContent : req.session[uniqueShareCode].shareContent;
							req.session[uniqueShareCode].shareImg = json.data.shareInfo.shareImg? json.data.shareInfo.shareImg : req.session[uniqueShareCode].shareImg;
						}

						let finalJson = wxTool.getWxSignature(
							req,
							jsapiTicket,
							req.session[uniqueShareCode].shareUrl ,
							req.session[uniqueShareCode].shareTitle,
							req.session[uniqueShareCode].shareContent,
							req.session[uniqueShareCode].shareImg );
						json.wxJson = finalJson;
						json.uniqueCode = cryptoTool.getEncAse192(uniqueCode, cryptoConf.privateKey);
						res.render('index2', json);
						resolve("ok");
					}
					catch (e) {
						loggerError.error("index  :" + e.message);
						resolve("ok");
					}
				});
			});
		});
	});
});

module.exports = router;
