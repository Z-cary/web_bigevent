$(function() {

    var layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 注册上传功能
    $('#btnChossImg').on('click', function() {
        $('#file').click();
    });
    // 为文件表单绑定 change 事件
    $('#file').on('change', function(e) {
        // console.log(e);
        // 通过 e.target.files 判断用户是否上传了文件
        const fileList = e.target.files;
        console.log(fileList);
        if (fileList.length === 0) {
            return layer.msg('请选择文件!');
        }
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 为确定按钮绑定事件
    $('#btnUpload').on('click', function(e) {
        e.preventDefault()
            // 获取用户上传的头像文件
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 发送请求
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('上传失败!');
                }
                layer.msg('上传成功!');
                window.parent.getUserInfo();
            }
        });
    })
})