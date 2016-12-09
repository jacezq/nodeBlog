/**
 * Created by jace on 2016/12/5.
 */

var express = require('express');
var router = express.Router();
router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send('对不起，您无权访问管理员页面！');
    }
    next();
});

router.get('/',function(req,res,next){
    res.send('后台管理页面');
});
module.exports = router;