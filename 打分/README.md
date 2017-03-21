# 简单的评级打分

<br>
![demo](http://7xlxgg.com1.z0.glb.clouddn.com/test.gif "示意图")
<br>

## 用法

```
new StarScore({
    container: $('.js-score'),
    starClass: 's-star',
    ativeStarClass: 's-star_active',
    onClick: function(index) {
        console.log(index);
        //do something
    }
});
```