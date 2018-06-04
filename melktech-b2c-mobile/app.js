let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let bodyParser = require('body-parser');
let multiparty = require('connect-multiparty');

let ajax = require('./routes/ajax');
let errorCenter = require('./routes/errorCenter');
let homePage = require('./routes/homePage');
let index = require('./routes/index');
let oneStepInsurance = require('./routes/oneStepInsurance');
let tool = require('./routes/tool');

let startPort = require('./config/startPort');

let log4js = require('log4js');
log4js.configure('./config/log4js.json');
let loggerInfo = log4js.getLogger("default");
let loggerError = log4js.getLogger("error");
loggerInfo.level = 'debug';
loggerInfo.debug("Some debug messages");

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('cookieMelktechB2c'));
app.use(session({
    secret: 'cookieMelktechB2c',//与cookieParser中的一致
	name:'cookieMelktechB2c',
    resave: true,
    cookie:{
        maxAge: 1000*60*60 // 设置session过期时间
    },
    saveUninitialized:true
}));
app.use(multiparty({uploadDir:'./temp',maxFieldsSize: 100 * 1024 * 1024 }));
app.use(startPort.projectUrl, express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){ // 如果用户还有操作 延时
    req.session._garbage = Date();
    req.session.touch();
    next();
});
//传递 根 和url
app.use(function(req, res ,next){
    res.locals.localurl =   req.protocol+"://"+req.headers.host;
    res.locals.projectUrl = startPort.projectUrl;
    next();
});


app.use(startPort.projectUrl ,express.static(path.join(__dirname, 'public')));

app.use(startPort.projectUrl,index);
app.use(startPort.projectUrl,errorCenter);
app.use(startPort.projectUrl,oneStepInsurance);
app.use(startPort.projectUrl,tool);
app.use(startPort.projectUrl,ajax);

//判session中需要的参数在不在 5个必要的参数
//校验5个参数
app.use(function(req, res ,next){
	if(!req.session.finalData || (!req.session.finalData.salemanCode && !req.session.finalData.channelOperator )|| ((!req.session.finalData.planCode
		|| !req.session.finalData.planGroupCode || !req.session.finalData.entCode) && !req.session.finalData.productCode )){
		let errorJson = {};
		errorJson.msg="缺少必要参数，请关闭页面重新进入";
		res.render("errorCenter" , errorJson);
		return false;
	}else{
		req.body.planCode = req.session.finalData.planCode ;
		req.body.planGroupCode = req.session.finalData.planGroupCode ;
		req.body.productCode = req.session.finalData.productCode;
		next();
	}
});
app.use(startPort.projectUrl,homePage);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	if(req.url == "/favicon.ico"){
		res.send("");
	}else{
		loggerError.error(req.method);
		loggerError.error(req.url);
		let err = new Error('Not Found');
		err.status = 404;
		next(err);
    }
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    loggerError.error(res.locals);
    // render the error page
    res.status(err.status || 500);
    if(err.status == 404){
        return res.redirect(startPort.projectUrl);
    }
    res.render('errorCenter');
});

module.exports = app;
