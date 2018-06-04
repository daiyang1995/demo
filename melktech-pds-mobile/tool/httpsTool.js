/**
 * http://usejsdoc.org/

 */
'use strict';
var https = require('https');
var qs = require('querystring');
var fs = require('fs');
var httpUrlConf = require('./../config/httpUrlConf');
var port = httpUrlConf.httpsPort;
var hostName = httpUrlConf.hostName;
var method = "post";
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");
/**
 * https请求
 * @param req
 * @param callback function()
 */
function httpsTool(req,callback){
    req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
    loggerInfo.info("requireUrl = "+httpUrlConf.baseHttpsDomain+req.body.url);
    loggerInfo.info("requireBody = " +JSON.stringify(req.body));
    var options = {
        hostname: hostName,
        port: port,
        path: httpUrlConf.baseHttpsDomain+req.body.url,
        method: method,
        rejectUnauthorized: false,
        headers: {
            "content-type": "application/json"
        },
        key: fs.readFileSync(httpUrlConf.key),
        cert: fs.readFileSync(httpUrlConf.cert)
    };
    // var content = qs.stringify(req.body);
    var req1 = https.request(options, callback);
    req1.on('error',  (e) => {
        loggerError.error('problem with request: ' + e.message);
    });
    req1.write(JSON.stringify(req.body));
    req1.end();
}

module.exports = httpsTool;
