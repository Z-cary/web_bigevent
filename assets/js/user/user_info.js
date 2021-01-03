$(function() {
    var layer = layui.layer;
    var form = layui.form;
    // 定义自定义验证规则
    form.verify({
        nickname: function(val) {
            if (val.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }

    })
    initUserInfo();
    // 发起请求获取用户信息
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取信息失败!')
                }
                layer.msg('获取数据成功!');
                // 利用 form.val() 方法快速为表单赋值
                form.val("formUserInfo", res.data)
            }
        });
    }
    // 为重置按钮设置点击事件
    $('#btnReset').on('click', function(e) {
            // 阻止表单的默认重置行为
            e.preventDefault();
            initUserInfo();
        })
        // 为提交修改按钮，设置 表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败!");
                }
                layer.msg("更新用户信息成功!");
                // initUserInfo();
                // 调用 window.parent.getUserInfo() 可以直接更新 首页用户的头像
                window.parent.getUserInfo();
            }
        });
    })

})