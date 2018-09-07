/**
 * http://usejsdoc.org/

 */
'use strict';
var fs = require('fs');
var images = require("images");
var ExifImage = require('exif').ExifImage;
var Jimp = require("jimp");
var log4js = require('log4js');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");

function uploadTool() {}

uploadTool.uploadSingleGZip = (req, resolve, resizeNum = 400) =>{ // 默认缩放到400
    let json = {};
    if(req.files.file.length){
        json.ret = "-1";
        json.msg = "只允许上传一张图片";
        if(resolve){
			resolve(json);
		}
        return json;

    }
    let path = req.files.file.path;
    let type = req.files.file.type;

	let data = fs.readFileSync("./"+path);
	let dataOriginal = new Buffer(data).toString('base64'); // 原始base64
	dataOriginal ="data:"+type+";base64,"  +dataOriginal;

	Jimp.read("./"+path , function (err, image) {
		if (err) {
		    console.log(err);
			json.imgBase64 = dataOriginal;
			json.imgBase64Original = dataOriginal;
			if(resolve){
				resolve(json);
			}
			return json;
        }
        image.exifRotate()
			.resize(resizeNum, Jimp.AUTO)
			.getBase64(Jimp.AUTO, function (err, dataReturn) {
				json.imgBase64Original = dataOriginal;
				if(!err){
					json.imgBase64 = dataReturn; //压缩后的base64
				}else {
					json.imgBase64 = dataOriginal;
					loggerError.info(err);
				}
				if(resolve){
					resolve(json);
				}
				return json;
			});
	});

};
uploadTool.uploadSingle = (req) =>{
    let json = {};
    if(req.files.file.length){
        json.ret = "-1";
        json.msg = "只允许上传一张图片";
        return json;
    }
    let path = req.files.file.path;
    let type = req.files.file.type;
    let data = fs.readFileSync("./"+path);
    data = new Buffer(data).toString('base64');
    data ="data:"+type+";base64,"  +data;
    json.imgBase64 = data;
    return json;
};
uploadTool.uploadBatch = (req) =>{
    var array = [];
    if(req.files.file.length){
        for(let i = 0 ; i < req.files.file.length ; i++){
            let path = req.files.file[i].path;
            let type = req.files.file[i].type;
            let data = fs.readFileSync("./"+path);
            data = new Buffer(data).toString('base64');
            data ="data:"+type+";base64,"  +data;
            array[i] = data;
            // req.body.imgBase64[i] = data;
        }
    }else{
        let path = req.files.file.path;
        let type = req.files.file.type;
        let data = fs.readFileSync("./"+path);
        data = new Buffer(data).toString('base64');
        data ="data:"+type+";base64,"  +data;
        array[0] = data;
    }
    let json = {};
    json.imgBase64 = array;
    return json;
};
module.exports = uploadTool;