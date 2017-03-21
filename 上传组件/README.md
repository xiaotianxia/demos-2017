#上传组件 支持图片和视频
##用法
```
function renderPicUpload() {
    var self = this;
    var coverUpload = new Upload($('#upload'), {
        uploadType: 'image',//video
        MIN_PICSIZE: 1024,
        MAX_PICSIZE: 1024 * 1024 * 10,
        options: {
            uploadUrl: '/api/upload',
        },
        onSelect: function() {
            return true;
        },
        onSelectError: function(options) {
            var errorTips = '';
            if (options.type == 'format') {
                errorTips = '格式有误！';
            } else if (options.type == 'size') {
                errorTips = '需符合指定大小(1k - 10M)！';
            }
            alert(errorTips);
        },
        onProgress: function (percent) {
            console.log('上传中' + percent + '%...');
        },
        onSuccess: function(json) {
            console.log(json);
            console.log('上传成功！');
        }
    });
}

renderPicUpload();
```