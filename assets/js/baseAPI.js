// 设置 API 请求的拼接
$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 统一为有权限的请求设置请求头
    // 判断请求中是否含有 /my/ 含有则是有权限的请求
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        };
    }
    // 全局挂载 complete 回调函数
    options.complete = res => {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空 token
            localStorage.removeItem('token');
            // 强制跳转到 登陆页面
            location.href = 'login.html';
        }
    };

})