$(function() {
    // layui 弹出层
    var layer = layui.layer;
    // layui 表单
    var form = layui.form;
    // layui 分页
    var laypage = layui.laypage;
    // 定义 template 时间美化函数
    template.defaults.imports.dataFormat = function(data) {
        const time = new Date(data);
        const y = time.getFullYear();
        const m = blt(time.getMonth() + 1);
        const d = blt(time.getDate());

        const h = blt(time.getHours());
        const f = blt(time.getMinutes());
        const s = blt(time.getSeconds());

        return y + "-" + m + "-" + d + "  " + h + ":" + f + ":" + s;
    };
    // 定义补零函数
    function blt(tim) {
        return tim < 10 ? "0" + tim : tim;
    };

    // 定义一个查询的参数对象
    var q = {
        pagenum: 1, //页码值
        pagesize: 3, //每页显示几条的数据
        cate_id: "", //文章分类的Id
        state: "" //文章的状态
    }


    // 获取文章数据方法
    initTable();
    // 渲染文章分类列表
    initCate();
    // 渲染表格数据
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg("获取失败!");
                // 数据展示
                var htmlStr = template("spl_shu", res);
                $('tbody').html(htmlStr);
                // 渲染分页
                renderPage(res.total);
            }
        })
    }
    // 初始化文章分类列表的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) return layer.msg("获取文章列表失败!");
                var cateStr = template("tpl_cate", res);
                $('[name=cate_id]').html(cateStr);
                form.render();
                // layui 使用模板引擎渲染页面 需调用 form.render() 方法

            }
        });
    }

    // 为筛选按钮 绑定点击事件 实现筛选功能
    $("#form_search").on('submit', function(e) {
        e.preventDefault();
        // 获取用户所选的值
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        // 将用户所选的值 赋值给 请求的数据的对象 q
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新数据展示表格数据
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        //调用分页方法
        laypage.render({
            elem: 'test1', //注意，这里的 test1 是 ID,不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页展示几条数据
            curr: q.pagenum, //默认选中的起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            limits: [2, 5, 8, 10],
            // 分页切换 就会触发 jump 函数
            jump: function(obj, first) {
                // console.log(obj.curr);得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit);得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    // 根据最新的页码值重新渲染展示数据
                    initTable();
                }
            }
        });
    }

    // 通过代理的方式 实现删除的功能
    $('tbody').on('click', '.btn-delet', function() {
        // 当前页的 删除按钮的个数
        const len = $(".btn-delet").length;
        var id = $(this).attr('data-id');
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg("删除失败!");
                    layer.msg("删除成功!");
                    // 当页面只有一个删除按钮时,在完成删除操作时就会没有
                    if (len == 1) {
                        // 页码值 最小为 1,判断页码是否为1,不为1则减1,否则 还是为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    // 页码值发生变化再重新渲染页面
                    initTable();
                }
            });
            layer.close(index);
        });

    })

    // 通过代理的方式 实现编辑的功能
    $('tbody').on('click', '.btn-modify', function() {
        location.href = '/article/art_pub.html';
    })

})