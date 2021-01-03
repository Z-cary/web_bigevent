$(function() {
    var form = layui.form;
    var layer = layui.layer;

    // 自定义密码验证规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samPwd: value => {
            const newpwd = $('[name=oldPwd]').val();
            if (value === newpwd) {
                return "新旧密码一致,请重新输入";
            }
        },
        repwd: value => {
            const newpwd = $('[name=newPwd]').val();
            if (value !== newpwd) {
                return "密码不一致,请重新输入";
            }
        }
    });

    // 注册表单提交事件
    $('.layui-form').submit(function(e) {
        // const data = {
        //     oldPwd: $('[name=oldPwd]').val(),
        //     newPwd: $('[name=newPwd]').val()
        // }
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("密码修改成功！");
                $('.layui-form')[0].reset();
                localStorage.removeItem('token');
                window.parent.location.href = '/login.html'
            }
        });
    });
})