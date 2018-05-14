/**
 * http://usejsdoc.org/

 */
'use strict';
var fs = require('fs');
var images = require("images");
function uploadTool() {
}

uploadTool.uploadSingleGZip = (req,resize = 400) =>{ // 默认缩放到400
    let json = {};
    if(req.files.file.length){
        json.ret = "-1";
        json.msg = "只允许上传一张图片";
        return json;
    }
    let path = req.files.file.path;
    let type = req.files.file.type;
    let data = fs.readFileSync("./"+path);

    let dataReturn  = images( new Buffer(data) ).size(resize).encode("jpg", {operation:50}).toString('base64');//回显页面的压缩过的base64
    let dataOriginal = new Buffer(data).toString('base64'); // 放入redis的原始base64
    console.log(dataOriginal);
    dataReturn ="data:"+type+";base64,"  +dataReturn;
    json.imgBase64 = dataReturn;
    return json;
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