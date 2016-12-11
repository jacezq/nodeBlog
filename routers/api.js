/**
 * Created by jace on 2016/12/5.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/content');

var responseDate;

router.use(function (req, res, next) {
    responseDate = {
        code: 0,
        message: ''
    };
    next();
});

//注册操作
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
        responseDate.message = '恭喜你，注册成功';
        res.json(responseDate);
    });
});

//登录操作
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

//退出登录
router.get('/user/logOut', function (req, res) {
    req.cookies.set('userInfo', null);
    res.json(responseDate);
});

//文章评论加载
router.get('/comment', function (req, res) {
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        responseDate.data = content.comments;
        // console.log('responseDate');
        // console.log(responseDate);
        res.json(responseDate);
    })
});

//文章评论接口
router.post('/comment/post', function (req, res) {
    var contentId = req.body.contentid || '';
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };

    //查询文章内容，并返回该id下文章全部信息
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseDate.message = '评论成功';
        responseDate.data = newContent;
        res.json(responseDate);
    })
});


module.exports = router;