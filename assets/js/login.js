// jQuery 入口函数
$(function() {
    // 点击去注册
    $('.link_reg').click(function() {
        $('.login_box').stop().hide()
        $('.reg_box').stop().show();
    });
    // 点击登录
    $('.link_login').click(function() {
        $('.reg_box').stop().hide()
        $('.login_box').stop().show();
    });



    // 设置表单验证 从 layui 中获取form 元素
    var form = layui.form;
    var layer = layui.layer;
    // 通过 form.verify() 方法，自定义自己的校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function(val) {
            let psw = $('.reg_box [name=psw]').val();
            if (psw !== val) {
                return "两次密码不一致!"
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').submit(function(e) {
        e.preventDefault();
        let data = {
            username: $('.reg_box [name=username]').val(),
            password: $('.reg_box [name=psw]').val()
        };
        $.post("/api/reguser", data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录！');
                // 模拟人的点击行为
                $('.link_login').click();
            },

        );
    });

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        let data = {
            username: $('.login_box [name=username]').val(),
            password: $('.login_box [name=psw]').val(),
        };
        $.ajax({
            type: "post",
            url: "/api/login",
            data: data,
            success: function(res) {
                if (res.status !== 0) { return layer.msg(res.message); }
                layer.msg('登陆成功');
                // 将登录成功请求回来的 token 数据保存到本地
                localStorage.setItem('token', res.token);
                location.href = '/index.html';


            }
        });
    })
})