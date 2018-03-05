var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var multiparty = require('connect-multiparty');

var index = require('./routes/index');
var users = require('./routes/users');
var binding = require('./routes/binding');
var CommonInformation = require('./routes/CommonInformation');
var SafeguardManagement = require('./routes/SafeguardManagement');
var ApplyClaim = require('./routes/ApplyClaim');
var Claim = require('./routes/Claim');
var startPort = require('./config/startPort');
var redisTool = require("./tool/redisTool");

var log4js = require('log4js');
log4js.configure('./config/log4js.json');
var loggerInfo = log4js.getLogger("default");
var loggerError = log4js.getLogger("error");
loggerInfo.level = 'debug';
loggerInfo.debug("Some debug messages");

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// var engines = require('consolidate');
// app.engine('html', engines.ejs);
// app.set('view engine', 'html');

app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('cookieMelktech'));
app.use(session({
    secret: 'cookieMelktech',//与cookieParser中的一致
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

// app.use(function (req, res, next) {
//     if(req.session.user){
//         redisTool.exists(req.sessionID,function ( error,response ) {
//             if(response){ //存在为1
//                 redisTool.expire(req.sessionID, 60 * 30);
//                 next();
//             }else{
//                 let json = {};
//                 json.msg = "登陆过期，请重新从微信打开";
//                 res.render("pcError",json);
//             }
//         })
//     }else{
//         next();
//     }
// });
app.use(startPort.projectUrl,index);
app.use(startPort.projectUrl,binding);
app.use(startPort.projectUrl, users);
//登录拦截器
app.use(function (req, res, next) {
    var url = req.originalUrl;
    var state = req.query.state;
    loggerInfo.info("have state : " + state);
    loggerInfo.info("req.method  : " +req.method );
    let urllength = 0;
    if(url.indexOf("?") > 0 ){
        urllength = url.indexOf("?") ;
    }else{
        urllength = url.length;
    }
    if (!state && url.substring(0 , urllength ) != startPort.projectUrl && !req.session.user )  {
        loggerInfo.info("未登陆");
        if(req.method == "post" )
            return res.redirect(startPort.projectUrl);
        else if(req.method == "GET"){
            if(url.indexOf("?") > 0 ){
                loggerInfo.info("query : " + url.substring(url.indexOf("?")) );
                return res.redirect(startPort.projectUrl+url.substring(url.indexOf("?")))
            }else{
                return res.redirect(startPort.projectUrl);
            }
        }
    }
    next();
});

app.use(startPort.projectUrl,CommonInformation);
app.use(startPort.projectUrl,SafeguardManagement);
app.use(startPort.projectUrl,ApplyClaim);
app.use(startPort.projectUrl,Claim);
app.use(startPort.projectUrl+"index" , function (req, res, next) {
    return res.redirect(startPort.projectUrl);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    loggerError.error(req.method);
    loggerError.error(req.url);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
    res.render('error');
});

module.exports = app;
