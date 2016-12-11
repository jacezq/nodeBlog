/**
 * Created by jace on 2016/12/5.
 */
var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

var data;

router.use(function (req,res,next) {
    data = {
        userInfo: req.userInfo,
        categorys: []
    };
    Category.find().then(function (categorys) {
        data.categorys = categorys;
        next();
    });
});


router.get('/', function (req, res, next) {

        data.page= Number(req.query.page || 1);
        data.category= req.query.category || '';
        data.limit= 2;
        data.pages= 0;
        data.count= 0;

    var where = {};
    if (data.category) {
        where.category = data.category;
    }
    Content.where(where).count().then(function (count) {
        data.count = count;
        //总页数
        data.pages = Math.ceil(data.count / data.limit);

        //但当前页大于总页数时，取总页数的值
        data.page = Math.min(data.page, data.pages);

        //当前页小于总页数时，取第1页
        data.page = Math.max(data.page, 1);

        //忽略前面几条
        var skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({addTime: -1});
    }).then(function (contents) {
        data.contents = contents;
        res.render('main/index', data);
    });
});

//预览文章详情页
router.get('/view', function (req, res) {
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id:contentId
    }).populate(['category', 'user']).then(function (content) {
        // console.log(content);
        data.content = content;
        content.views ++;
        content.save();
        res.render('main/view',data);
    });
});



module.exports = router;