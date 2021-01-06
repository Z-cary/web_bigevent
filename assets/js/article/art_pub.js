$(function() {
    var layer = layui.layer;
    var form = layui.form;

    // 获取文章类别
    initCate();
    // 初始化富文本编辑器
    initEditor()
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    // 初始化文章列表
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg("初始化文章分类失败!");
                // 调用模板引擎渲染文章分类列表
                var cateStr = template("ch_sp", res);
                $('[name=cate_id]').html(cateStr);
                // 调用 layui 的 form.render() 方法
                form.render();
            }
        });
    }

    // 选择封面按钮绑定点击事件
    $("#btnChooseImage").on("click", function() {
        $("#coverFile").click();
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
            })
    })

    // 监听文件选择的 change 事件，拿到用户选择的文件
    $("#coverFile").change(function(e) {
        e.preventDefault();
        // 拿到用户选择的文件
        var files = e.target.files;
        if (files.length == 0) return layer.msg("请选择上传的照片！")
            // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 定义文章的发布状态
    var art_state = "已发布";
    $("#btnSave2").click(function() {
        art_state = "草稿";
    })


    // 检测表单区域的提交事件
    $("#form_pub").on("submit", function(e) {
        e.preventDefault();
        // 基于form 表单，创建一个 FormData 对象
        var fd = new FormData($(this)[0]);
        // 将 发布状态 添加到 fd 中
        fd.append('state', art_state);
        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将拿到的文件 添加到 fd 
                fd.append('cover_img', blob);
                // 拿到所有数据之后 发起 POST 请求
                publishArticle(fd);
            })

    })

    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 因为发起的是 FormData 格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) return layer.msg("发布文章失败!")
                layer.msg("发布文章成功!");
                location.href = "/article/art_list.html";
            }
        });
    }


})