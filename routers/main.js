/**
 * Created by jace on 2016/12/5.
 */
var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){

    // res.render('index');
    res.render('main/index',{
        userInfo : req.userInfo
    });
});



module.exports = router;