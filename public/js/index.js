/**
 * Created by jace on 2016/12/6.
 */
$(function(){
    var $loginBox = $("#loginBox");
    var $registerBox = $("#registerBox");
    var $userInfo = $("#userInfo");


    $loginBox.find("a").click(function(){
        $loginBox.hide();
        $registerBox.show();
    });
    $registerBox.find("a").click(function(){
        $registerBox.hide();
        $loginBox.show();
    });

    //注册
    $registerBox.find("button").click(function(){
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$registerBox.find('[name="username"]').val(),
                password:$registerBox.find('[name="password"]').val(),
                repassword:$registerBox.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(result){
                $registerBox.find(".textCenter").html(result.message);
                if(!result.code){
                    setTimeout(function(){
                        $registerBox.hide();
                        $loginBox.show();
                    },1000);
                }
                console.log(result);
            }
        })
    });

    //登录
    $loginBox.find("button").click(function(){
        $.ajax({
            url : '/api/user/login',
            type:'post',
            dataType : 'json',
            data : {
                username:$loginBox.find('[name="username"]').val(),
                password:$loginBox.find('[name="password"]').val()
            },
            success:function(result){
                $loginBox.find('.textCenter').html(result.message);
                //登录成功
                if(!result.code){
                    // setTimeout(function(){
                    //     console.log("登录成功");
                    //     console.log(result);
                    //     $loginBox.hide();
                    //     $userInfo.show();
                    //     $userInfo.find('.username').html(result.userInfo.username);
                    //     $userInfo.find(".info").html('欢迎光临我的博客！');
                    // },1000);
                    //登录成功，刷新页面
                    window.location.reload();
                }
            }
        })
    });

    //退出登录
    $("#logOut").click(function(){
        $.ajax({
            url : '/api/user/logOut',
            success:function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    });


})