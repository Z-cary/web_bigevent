$(function() {
    // 调用获取用户信息函数
    getUserInfo()


})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        header: localStorage.getItem('token'),
        success: function(res) {
            console.log(res);
        }
    });
}