let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let bodyParser = require('body-parser');
let multiparty = require('connect-multiparty');

let applicant = require('./routes/applicant');
let bankCard = require('./routes/bankCard');
let index = require('./routes/index');
let invite = require('./routes/invite');
let login = require('./routes/login');
let password = require('./routes/password');
let personalInfo = require('./routes/personalInfo');
let plan = require('./routes/plan');
let policy = require('./routes/policy');
let register = require('./routes/register');
let tool = require('./routes/tool');
let userCenter = require('./routes/userCenter');

let startPort = require('./config/startPort');
let redisTool = require('./tool/redisTool');
let redisConf = require('./config/redisConf');

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
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('cookieMelktechPds'));
app.use(session({
    secret: 'cookieMelktechPds',//与cookieParser中的一致
	name:'cookieMelktechPds', //修改cookie的name 默认:connect.sid
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
	if(req.session.saleman ){
		// redisTool.hset(redisConf.redisPrefix + "onlineUser" , req.session.saleman.mobile , new Date().getTime() , function (error , res) {
			loggerInfo.info("操作时间更新 : " + req.session.saleman.mobile +"->"+ new Date().getTime()+"("+new Date().toLocaleString()+")" );
	// 	});
	}
    next();
});


app.use(startPort.projectUrl ,express.static(path.join(__dirname, 'public')));

app.use(startPort.projectUrl,index);
app.use(startPort.projectUrl,invite);
app.use(startPort.projectUrl,login);
app.use(startPort.projectUrl,register);
app.use(startPort.projectUrl,tool);

//校验
app.use(function(req, res ,next){
	if(!req.session.saleman ){
		res.redirect("login");
		loggerInfo.debug(req.ip + "未登录");
		return false;
	}
	next();
});
app.use(startPort.projectUrl,applicant);
app.use(startPort.projectUrl,bankCard);
app.use(startPort.projectUrl,password);
app.use(startPort.projectUrl,personalInfo);
app.use(startPort.projectUrl,plan);
app.use(startPort.projectUrl,policy);
app.use(startPort.projectUrl,userCenter);

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
