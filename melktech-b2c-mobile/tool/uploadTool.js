/**
 * http://usejsdoc.org/

 */
'use strict';
let fs = require('fs');
let pathTool = require("path");
let images = require("images");
let ExifImage = require('exif').ExifImage;
let Jimp = require("jimp");
let co = require("co");
let log4js = require('log4js');
let loggerInfo = log4js.getLogger("default");
let loggerError = log4js.getLogger("error");

function mkdirsSync(dirname) {
	if (fs.existsSync(dirname)) {
		return true;
	} else {
		if (mkdirsSync(pathTool.dirname(dirname))) {
			fs.mkdirSync(dirname);
			return true;
		}
	}
}
function checkType(str){
	const acceptType = ["image/jpg","image/png","image/jpeg"];
	return acceptType.indexOf(str) < 0
}

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
	json.path = path;
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

uploadTool.uploadBatchGZip = (req, resolve, filePath, resizeNum = 400) =>{ // 默认缩放到400
	co(function* () {
		let array = [];
		if (req.files.file.length) {
			for (let i = 0; i < req.files.file.length; i++) {
				yield new Promise((resolve1, reject1) => {
					let json = {};
					let path = req.files.file[i].path;
					let type = req.files.file[i].type;
					let data = fs.readFileSync("./" + path);
					let dataOriginal = new Buffer(data).toString('base64'); // 原始base64
					dataOriginal = "data:" + type + ";base64," + dataOriginal;
					if(filePath){
						mkdirsSync(filePath);
						let copyPath = path.replace("temp",filePath);
						fs.createReadStream(path).pipe(fs.createWriteStream(copyPath));
						json.path = copyPath.substring(copyPath.lastIndexOf("\\")+1 , copyPath.length);
					}else {
						json.path = path.substring(path.lastIndexOf("\\")+1 , path.length);
					}
					Jimp.read("./" + path, function (err, image) {
						if (err) {
							console.log(err);
							json.imgBase64 = dataOriginal;
							json.imgBase64Original = dataOriginal;
							array.push(json);
							resolve1(json);
						}
						image.exifRotate()
							.resize(resizeNum, Jimp.AUTO)
							.getBase64(Jimp.AUTO, function (err, dataReturn) {
								json.imgBase64Original = dataOriginal;
								if (!err) {
									json.imgBase64 = dataReturn; //压缩后的base64
								} else {
									json.imgBase64 = dataOriginal;
									loggerError.info(err);
								}
								array.push(json);
								resolve1(json);
							});
					});
				});
			}
		} else {
			let json = yield new Promise((resolve1, reject1) => {
				uploadTool.uploadSingleGZip(req, resolve1, resizeNum);
			});
			yield new Promise((resolve1, reject1) => {
				let path = req.files.file.path;
				if(filePath){
					mkdirsSync(filePath);
					let copyPath = path.replace("temp",filePath);
					fs.createReadStream(path).pipe(fs.createWriteStream(copyPath));
					json.path = copyPath.substring(copyPath.lastIndexOf("\\")+1 , copyPath.length);
				}else {
					json.path = path.substring(path.lastIndexOf("\\")+1 , path.length);
				}
				array.push(json);
				resolve1("ok");
			});

		}
		yield new Promise((resolve1, reject1) => {
			let json = {};
			json.array = array;
			if (resolve) {
				resolve(json);
			}
			resolve1("ok");
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

uploadTool.uploadBatch = (req, filePath) =>{
	try{
		let array = [];
		if(req.files.file.length){
			for(let i = 0 ; i < req.files.file.length ; i++){
				let path = req.files.file[i].path;
				let type = req.files.file[i].type;
				if(checkType(type)){
					throw {"ret":"-1","msg":"第"+(i+1)+"个图片格式不合法"};
				}
				let data = fs.readFileSync("./"+path);
				data = new Buffer(data).toString('base64');
				data ="data:"+type+";base64,"  +data;
				let jsonOne = {};
				jsonOne.imgBase64 = data;
				if(filePath){
					mkdirsSync(filePath);
					let copyPath = path.replace("temp",filePath);
					fs.createReadStream(path).pipe(fs.createWriteStream(copyPath));
					jsonOne.path = copyPath.substring(copyPath.lastIndexOf("\\")+1 , copyPath.length);
				}else {
					jsonOne.path = path.substring(path.lastIndexOf("\\")+1 , path.length);
				}
				array.push(jsonOne);
			}
		}else{
			let path = req.files.file.path;
			let type = req.files.file.type;
			if(checkType(type)){
				throw {"ret":"-1","msg":"第1个图片格式不合法"};
			}
			let data = fs.readFileSync("./"+path);
			data = new Buffer(data).toString('base64');
			data ="data:"+type+";base64,"  +data;
			let jsonOne = {};
			jsonOne.imgBase64 = data;
			if(filePath){
				mkdirsSync(filePath);
				let copyPath = path.replace("temp",filePath);
				fs.createReadStream(path).pipe(fs.createWriteStream(copyPath));
				jsonOne.path = copyPath.substring(copyPath.lastIndexOf("\\")+1 , copyPath.length);
			}else {
				jsonOne.path = path.substring(path.lastIndexOf("\\")+1 , path.length);
			}
			array.push(jsonOne);

		}
		let json = {};
		json.array = array;
		return json;
	}catch(e){
		if("ret" in e){
			return e;
		}else{
			return {"ret":"-1","msg":"系统异常"};
		}
	}
};
module.exports = uploadTool;