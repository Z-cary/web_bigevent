$(function() {
    // 调用获取用户信息函数
    getUserInfo()
    var layer = layui.layer;
    // 实现推出功能
    $('#btnLogout').click(function(e) {
        e.preventDefault();
        layer.confirm('是否要退出？', { icon: 3, title: '提示' }, function(index) {
            // 清空本地存储中的 token
            localStorage.removeItem('token');
            // 跳转到 login.html 登录页面
            location.href = 'login.html';
            layer.close(index);
        });
    });
})

// 获取用户的基本信息
function getUserInfo() {

    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败!');
            }
            // 调用渲染头像函数
            renderAvatar(res.data)
        },
        // 无论成功还是失败,都会调用 complete 函数
        // complete: res => {
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空 token
        //         localStorage.removeItem('token');
        //         // 强制跳转到 登陆页面
        //         location.href = 'login.html';
        //     }
        // }
    });
}
// 定义渲染用户头像的函数
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`);
    // 按需用户渲染头像
    if (user.user_pic !== null) {
        // 渲染头像
        $('.layui-nav-img').prop('src', user_pic).show();
        $('.text_avatar').hide();
    } else {
        // 渲染文本头像
        var first = name[0].toUpperCase();
        $('.layui-nav-img').hide();
        $('.text_avatar').html(first).show();
    }

}