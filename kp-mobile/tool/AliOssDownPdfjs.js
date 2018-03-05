/**
 * http://usejsdoc.org/

 */
'use strict';
var fs = require("fs");
var request = require('request');

var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

var AliOssDownPdfjs = function () {
};

AliOssDownPdfjs.downloadPDF = (res, localPath, url, json) => {
    try {
        fs.exists(localPath, function (exists) {
            if (!exists) {
                try {
                    let ws = fs.createWriteStream(localPath, {defaultEncoding: 'utf8'});
                    ws.on("error",function (e) {
                        var jsonError = {};
                        jsonError.ret = -1;
                        jsonError.msg = "下载文件出错";
                        loggerError.error("downloadPDF  :" + e.message);
                        res.send(jsonError);
                    });
                    ws.on("finish", function () {
                        res.send(json);
                    });
                    request(url).pipe(ws);

                } catch (e) {
                    var jsonError = {};
                    jsonError.ret = -1;
                    jsonError.msg = "下载文件出错";
                    loggerError.error("downloadPDF  :" + e.message);
                    res.send(jsonError);
                }
            } else {
                res.send(json);
            }
        });
    } catch (e) {
        var jsonError = {};
        jsonError.ret = -1;
        jsonError.msg = "文件路径出错";
        loggerError.error("downloadPDF  :" + e.message);
        res.send(jsonError);
    }
};

AliOssDownPdfjs.getStream = (res, localPath) => {
    try {
        var rs = fs.createReadStream(localPath, {defaultEncoding: 'utf8'});
        var responseData = [];//存储文件流
        rs.on('data', function (chunk) {
            responseData.push(chunk);
        });
        rs.on('end', function () {
            var finalData = Buffer.concat(responseData);
            res.send(finalData);
        });
        rs.on('error', function (err) {
            loggerError.error(err);
            res.send("");
        });
    } catch (e) {
        var jsonError = {};
        jsonError.ret = -1;
        jsonError.msg = "读取文件出错";
        loggerError.error("getStream  :" + e.message);
        res.send(jsonError);
    }
};

module.exports = AliOssDownPdfjs;