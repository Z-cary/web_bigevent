$(function() {
    var form = layui.form;
    var layer = layui.layer;

    // 1.发送请求，获取数据，进行页面的渲染
    initCateList();

    function initCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: res => {
                // console.log(res);
                if (res.status !== 0) return layer.msg("获取失败!");
                // layer.msg("获取数据成功!")
                var htmlStr = template("tpl_lei", res);
                $('tbody').html(htmlStr);
            }
        });
    }
    // 2.添加分类功能
    // 为添加绑定点击事件
    var indexAdd = null;
    $("#btnAddCate").on('click', function(e) {
        e.preventDefault();
        indexAdd = layer.open({
            type: 1,
            title: '添加文章类别',
            area: ['500px', '250px'],
            content: $("#dialog_add").html()
        });
    });
    // 通过代理的方式 为确认添加 绑定表单事件

    $("body").on("submit", '#form_add', function(e) {
        e.preventDefault();
        console.log($(this).serialize());
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg("添加分类失败!")
                layer.msg("添加成功!");
                initCateList();
                layer.close(indexAdd);
            }
        });
    });
    // 3.修改文章分类功能
    // 更新文章分类数据
    var indexEait = null;
    $('tbody').on('click', '#btn_adit', function() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + $(this).attr('data-id'),
            success: function(res) {
                if (res.status !== 0) return;
                form.val("form_eait", res.data)
            }
        });
        indexEait = layer.open({
            type: 1,
            title: '修改文章类别',
            area: ['500px', '250px'],
            content: $("#dialog_eait").html()
        });
    });
    // 监测  form_eait 表单的提交事件
    $('body').on('submit', '#form_eait', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg("修改失败!");
                layer.msg("修改成功!");
                initCateList();
                layer.close(indexEait);

            }
        });
    })


    // 4.删除文章分类功能
    $('tbody').on('click', '#btn_delet', function() {
        let id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            // 发送请求，删除数据
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) return layer.msg("删除失败!");
                    layer.msg("删除成功!");
                    initCateList();
                    layer.close(index);
                }
            });

        });
    })






})