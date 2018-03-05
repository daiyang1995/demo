/**
 * http://usejsdoc.org/

 */
'use strict';
var https = require('https');
var wxConf = require("../config/wxConf");

var crypto = require("./crypto");

var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

function wxTool() {};

/**
 * 获取用户信息
 * @param access_token String
 * @param openId String
 * @param callBackFunction function(res)
 */
wxTool.getUserInfo = function(access_token,openId ,res, callBackFunction){
    https.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openId}&lang=zh_CN`, callBackFunction)
        .on('error', function (e) {
            loggerError.error("发生错误:" +e);
            let json = {};
            json.msg = e;
            return res.render("pcError",json);
        });
};

/**
 * 获取用户openId
 * @param code String
 * @param callBackFunction function(res)
 */
wxTool.getUserOpenId = function (code,callBackFunction) {
    https.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wxConf.appId}&secret=${wxConf.secret}&code=${code}&grant_type=authorization_code`,callBackFunction);
};

/**
 * 获取accessToken
 * @param callBackFunction function(res)
 */
wxTool.getAccessToken = function (callBackFunction) {
    https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxConf.appId}&secret=${wxConf.secret}`,callBackFunction);
};
/**
 * 获取jsapi_ticket
 * @param access_token
 * @param callBackFunction
 */
wxTool.getJsapiTicketo =function(access_token ,callBackFunction ){
    https.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`,callBackFunction);
};

/**
 * 获取微信js签名
 * @param finalJson
 * @param req
 * @param JsapiTicket
 * @returns {*}
 */
wxTool.getWxSignature = function(finalJson , req ,JsapiTicket){
    finalJson.timestamp = Math.floor( new Date().getTime().timestamp/1000);
    finalJson.url = req.protocol+"://"+req.headers.host+req.originalUrl;
    finalJson.noncestr = "asdfaaaa";
    finalJson.appId = wxConf.appId;
    loggerInfo.info("签名str : " + `jsapi_ticket=${JsapiTicket}&noncestr=${finalJson.noncestr}&timestamp=${finalJson.timestamp}&url=${finalJson.url}`);
    finalJson.signature = crypto.getSha1(`jsapi_ticket=${JsapiTicket}&noncestr=${finalJson.noncestr}&timestamp=${finalJson.timestamp}&url=${finalJson.url}`);
    return finalJson;
}
module.exports = wxTool;