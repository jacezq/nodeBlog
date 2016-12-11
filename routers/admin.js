/**
 * Created by jace on 2016/12/5.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send('对不起，您无权访问管理员页面！');
    }
    next();
});

router.get('/', function (req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

//用户管理
router.get('/user', function (req, res, next) {
    /**
     * 从数据库获取用户数据
     * users查询后返回的总用户数量
     * limit(number)限制获取的数据条数
     * skip(2),表示忽略前两条数据
     *
     * 每页显示2条
     *1:1~2:0
     * 2:3~4:2-》(当前页-1)*limit
     * 3:5~6:4
     *
     */
    var page = Number(req.query.page || 1);
    var limit = 2;
    var skip = 0;
    var pages = 0;
    User.count().then(function (count) {
        //总页数
        pages = Math.ceil(count / limit);

        //但当前页大于总页数时，取总页数的值
        page = Math.min(page, pages);

        //当前页小于总页数时，取第1页
        page = Math.max(page, 1);

        //忽略前面几条
        skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index', {
                userInfo: req.userInfo,

                users: users,
                count: count,
                pages: pages,
                page: page,
                limit: limit,
                type: 'user'
            });
        });

    });

});

//分类信息首页
router.get('/category', function (req, res) {
    /**
     * 从数据库获取用户数据
     * users查询后返回的总用户数量
     * limit(number)限制获取的数据条数
     * skip(2),表示忽略前两条数据
     *
     * 每页显示2条
     *1:1~2:0
     * 2:3~4:2-》(当前页-1)*limit
     * 3:5~6:4
     *
     */
    var page = Number(req.query.page || 1);
    var limit = 2;
    var skip = 0;
    var pages = 0;
    Category.count().then(function (count) {
        //总页数
        pages = Math.ceil(count / limit);

        //但当前页大于总页数时，取总页数的值
        page = Math.min(page, pages);

        //当前页小于总页数时，取第1页
        page = Math.max(page, 1);

        //忽略前面几条
        skip = (page - 1) * limit;

        Category.find().limit(limit).skip(skip).then(function (categorys) {
            console.log(categorys);
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categorys: categorys,
                count: count,
                pages: pages,
                page: page,
                limit: limit,
                type: 'category'
            });
        });

    });
});

//删除分类信息
router.get('/category/delete', function (req, res) {
    var id = req.query.id || '';
    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: "删除成功",
            url: '/admin/category'
        });
    })
});

//编辑分类信息
router.get('/category/edit', function (req, res, next) {
    var id = req.query.id;
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: "编辑信息不存在"
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })
});

//分类编辑信息修改保存
router.post('/category/edit', function (req, res, next) {
    var id = req.query.id || '';
    var name = req.body.name;
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                meassage: '编辑分类不存在'
            });
            return Promise.reject();
        } else {
            if (name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                })
            }
        }
    }).then(function (newCategory) {
        if (newCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '已经存在改分类名称'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })
});

//添加分类信息
router.get('/category/add', function (req, res) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

//分类保存
router.post('/category/add', function (req, res) {
    var name = req.body.name;
    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: "分类名称不能为空"
        });
        return;
    }

    Category.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: "该分类名称已经存在"
            });
            return Promise.reject();
        } else {
            return new Category({
                name: name
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: "添加分类成",
            url: "/admin/category"
        });
    })

});

//内容管理首页
router.get('/content', function (req, res, next) {

    var page = Number(req.query.page || 1);
    var limit = 2;
    var skip = 0;
    var pages = 0;
    Content.count().then(function (count) {
        //总页数
        pages = Math.ceil(count / limit);

        //但当前页大于总页数时，取总页数的值
        page = Math.min(page, pages);

        //当前页小于总页数时，取第1页
        page = Math.max(page, 1);

        //忽略前面几条
        skip = (page - 1) * limit;

        Content.find().limit(limit).skip(skip).populate(['category','user']).sort({addTime:-1}).then(function (contents) {
            console.log(contents);
            res.render('admin/content_index', {
                userInfo: req.userInfo,

                contents: contents,
                count: count,
                pages: pages,
                page: page,
                limit: limit,
                type: 'content'
            });
        });

    });
});

//显示内容添加页面
router.get('/content/add', function (req, res, next) {
    Category.find().sort({_id: -1}).then(function (categorys) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categorys: categorys
        });
    })

});

//添加内容保存操作
router.post('/content/add', function (req, res) {
    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '分类名称不能为空'
        });
        return;
    }

    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        });
        return;
    }

    console.log(req.body);

    new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo.id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function (rs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '保存成功',
            url: '/admin/content'
        });
    })

});

//内容信息页，编辑部分
router.get('/content/edit', function (req, res, next) {
    var id = req.query.id || '';
    var categorys = [];
    Category.find().sort({_id: 1}).then(function (rs) {
        categorys = rs;
        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function (content) {
        console.log(content);
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '修改的信息不存在',
                url: '/admin/content'
            });
            return;
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                content: content,
                categorys: categorys
            });
        }
    });
});

//内容修改页，保存
router.post('/content/edit', function (req, res, next) {
    var id = req.body.id;
    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '分类名称不能为空'
        });
        return;
    }

    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        });
        return;
    }
    console.log(req.body);
    Content.update({
        id: id
    }, {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function (rs) {
        console.log(rs);
        res.render('admin/success', {
            userInfo: req.userIfo,
            message: '修改成功',
            url: '/admin/content'
        });
    })

});

//删除信息
router.get('/content/delete', function (req, res) {
    var id = req.query.id;
    Content.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容删除成功',
            url: '/admin/content'
        });
    })
});
module.exports = router;