var express = require('express');
var router = express.Router();
var redisTool = require("../tool/redisTool");
//k1Q8PO1jvg8PWuW4tLtt-wlbYSzsTC_L
/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.sessionID);
    redisTool.set(req.sessionID , 1 ,function(error,response){
        if(!error)
            redisTool.expire(req.sessionID, 60 * 30);
        else
            console.log("redis 成功");
    });
    res.send(req.session.user);
});
router.get('/uuuu', function(req, res, next) {
    req.session.user = "1";
    redisTool.set(req.sessionID , 1 ,function(error,response){
        if(!error)
            redisTool.expire(req.sessionID, 60 * 30);
        else
            console.log("redis 成功");
    });
    res.send("ok");
});
module.exports = router;
