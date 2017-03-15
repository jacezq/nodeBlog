/**
 * Created by jace on 2016/12/5.
 */
//加载express模块
var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
var bodyParse = require('body-parser');
var Cookies = require('cookies');
var User = require('./models/User');

//创建app应用 等同于nodeJS下的http.createServer()
var app = express();

//配置应用模板
//定义当前应用使用的模板引擎
//第一个参数表示模板引擎的名称，也是模板引擎的后缀
// 第二个参数表示用于解析处理模板内容的方法
// app.engine('html',swig.renderFile);
app.use('/public',express.static(__dirname+'/public'));

app.engine('html',swig.renderFile);
//设置文件存在的目录，第一个参数必须是'views',第二个参数是目录
app.set('views','./views');

//注册所使用的模板引擎，第一个参数必须是 view engine,第二个参数必须和app.engine中第一个参数一致
app.set('view engine','html');

swig.setDefaults({cache:false});
app.use(bodyParse.urlencoded({extended:true}));

app.use(function(req,res,next){
    req.cookies = new Cookies(req,res);

    //解析登录用户的登录信息
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try {
            //获取设置的cookies，并转换成JSON对象
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            //获取当前用户是否是管理员
            User.findById(req.userInfo.id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch (e){
            next();
        }
    }else{
        next();
    }
    // console.log(req.cookies.get('userInfo'));
});


app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

// app.use()

    /**
     * render 读取views目录下指定文件，并返回给客户端
     * 第一个参数，文件名称，默认不需要带后缀，自动解析.html
     *
     */
    // res.render('index');
    // res.send('<h1>欢迎光临我的博客</h1>');

// });


mongoose.connect('mongodb://localhost:27017/blog',function(err){
    if (err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        //监听http请求
        app.listen(8008);
    }
});

/**首页
 * req   request对象
 * res   response对象
 * next     函数
 */

// app.get('/',function(req,res,next){


