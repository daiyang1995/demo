/**
 * http://usejsdoc.org/

 */
'use strict';
var http = require('http');
var qs = require('querystring');
var httpUrlConf = require('./../config/httpUrlConf');
var port = httpUrlConf.httpPort;
var hostName = httpUrlConf.hostName;
var method = "POST";
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");
/**
 * http请求
 * @param req
 * @param callback function()
 */
function httpTool(req,  callback){
    req.body = Object.assign(req.body, req.query); //拼接 req.body 和req.query
    loggerInfo.info("requireUrl = "+httpUrlConf.baseHttpsDomain+req.body.url);
    loggerInfo.info("requireBody = " +JSON.stringify(req.body));
    var options = {
        hostname: hostName,
        port: port,
        path: httpUrlConf.baseHttpsDomain+req.body.url,
        method: method,
        // rejectUnauthorized: false,
        headers: {
            "content-type": "application/json"
            // 'Access-Control-Allow-Origin': "http://0" ,
            // 'Access-Control-Allow-Methods' : 'post',
            // 'Access-Control-Allow-Headers' : '*'
        }
    };
    // var content = qs.stringify(req.body);
    // console.log(JSON.stringify(req.body));
    var req1 = http.request(options, callback);
    req1.on('error',  (e) => {
        loggerError.error('problem with request: ' + e.message);
    });
    req1.write(JSON.stringify(req.body));
    req1.end();
}

module.exports = httpTool;
