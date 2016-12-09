/**
 * Created by jace on 2016/12/5.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');

var responseDate;

router.use(function (req, res, next) {
    responseDate = {
        code: 0,
        message: ''
    };
    next();
});

router.post('/user/register', function (req, res, netx) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if (username == '') {
        responseDate.code = 1;
        responseDate.message = '用户名不能为空';
        res.json(responseDate);
        return;
    }

    if (password == '') {
        responseDate.code = 2;
        responseDate.message = '密码不能为空';
        res.json(responseDate);
        return;
    }

    if (password != repassword) {
        responseDate.code = 3;
        responseDate.message = '两次输入的密码不一致';
        res.json(responseDate);
        return;
    }

    //判断用户名是否已注册
    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) {
            responseDate.code = 4;
            responseDate.message = '该用户名已经存在';
            res.json(responseDate);
            return;
        }
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
        // 保存用户注册信息
    }).then(function (newUserInfo) {
        console.log(newUserInfo);
        responseDate.message = '恭喜你，注册成功';
        res.json(responseDate);
    });
});

router.post('/user/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username == '' || password == '') {
        responseDate.code = 1;
        responseDate.message = '用户名或密码不能为空';
        res.json(responseDate);
        return;
    }
    //查询数据库中用户名和密码是否存在，如果存在登录成功
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo) {
            responseDate.code = 2;
            responseDate.message = '用户名或密码错误';
            res.json(responseDate);
            return;
        }

        //用户名密码正确
        responseDate.message = '登录成功';
        responseDate.userInfo = {
            username: userInfo.username,
            id: userInfo._id
        };

        //设置cookies,返回的json数据转换成字符串
        req.cookies.set('userInfo', JSON.stringify({
            username: userInfo.username,
            id: userInfo._id
        }));
        res.json(responseDate);
        return;

    });

});


router.get('/user/logOut', function (req, res) {
    req.cookies.set('userInfo', null);
    res.json(responseDate);
});
module.exports = router;