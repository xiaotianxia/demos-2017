# 简单的分页插件

## 用法：
```
function renderPager(totalSize) {
    var pager = new Pager({
            itemCount: totalSize,   //服务器返回
            size: 10,               //约定
            nextText: '下一页',
            prevText: '上一页'
        });
    var self = this;
    pager.onclick = function(index) {
        // self.pageNo = index;
        console.log('第' + index + '页，do something');
    }
    pager.render(document.querySelector('#pager'));
}
renderPager(105);//test
```

<img src="http://7xlxgg.com1.z0.glb.clouddn.com/pager.gif" alt="示意图">
