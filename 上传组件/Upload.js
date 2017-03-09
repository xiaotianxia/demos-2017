(function() {
   var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
   };

   /**
    * 上传组件
    *
    * @class Upload
    * @author LRain(leiyu86@gmail.com)
    * @param {HTMLElement} elem            需要触发执行上传的dom节点
    * @param {Object} config.onSelect      选择上传文件
    * @param {Object} config.onSelectError 选择上传文件出错
    * @param {Object} config.onLoading     iframe上传中
    * @param {Object} config.onProgress    html5上传中，带进度值
    * @param {Object} config.onLoaded      上传结束
    * @param {Object} config.onSuccess     上传成功
    * @param {Object} config.onError       上传失败
    */
   var Upload = function (elem, config) {
      this.$trigger = elem;
      this.config = $.extend({}, this.defaults, config);
      this.options = $.extend({}, this.defaultOptions, this.config.options);
      this.isHtml5 = window.File && window.FileReader && window.FileList && window.Blob && window.FormData ? true : false;
      this.uploading = false;
      this.render();
   };

   Upload.REG_IMAGE_FORMAT = /^.*\.(gif|jpeg|jpg|png|bmp)$/i;

   Upload.REG_VIDEO_FORMAT = /^.*\.(mp4|flv|mov)$/i;

   Upload.IMG_FORMAT = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];

   Upload.VIDEO_FORMAT = ['mp4', 'flv', 'mov'];

   Upload.prototype = {
      defaults: {
         uploadType: 'image',
         isPrivate: 0,
         isCheckFileType: true, //是否检查上传的文件类型，安卓系统无法返回图片类型，需要的时候设置false
         MIN_PICSIZE: 1024 * 10,  /// 10k
         MAX_PICSIZE: 1024 * 1024 * 500,   /// 500M
         onSelect: function () {},
         onSelectError: function () {},
         onLoading: function () {},
         onProgress: function () {},
         onLoaded: function () {},
         onSuccess: function () {},
         onError: function () {}
      },

      defaultOptions: {
         uploadUrl: '/upload' /// TODO: 上传至服务器url
      },

      render: function() {
         this.wrapperTrigger();
         if (this.isHtml5) {
            this.initHtml5Upload();
         } else {
            this.initIframeUpload();
         }
      },

      /**
       * 设置上传所需form、input、iframe标签
       *
       * @method wrapperTrigger
       */
      wrapperTrigger: function () {
         var acceptFilter = '', formatArray = [], i, len;
         if (this.config.uploadType === 'image') {
            for(i = 0, len = Upload.IMG_FORMAT.length; i < len; i++) {
               formatArray.push('image/' + Upload.IMG_FORMAT[i]);
            }
            acceptFilter = formatArray.join(',');
         } else {
            for(i = 0, len = Upload.VIDEO_FORMAT.length; i < len; i++) {
               formatArray.push('video/' + Upload.VIDEO_FORMAT[i]);
            }
            acceptFilter = formatArray.join(',');
         }
         var $triggerWrapper = this.$trigger;
         $triggerWrapper.append('<form style="display: block; height: 100%; left: 0; overflow: hidden; position: absolute; top: 0; width: 100%;" enctype="multipart/form-data" accept-charset="utf-8" method="POST" action="'+ this.options.uploadUrl +'">\
                                    <input type="file" name="Filedata" accept="' + acceptFilter + '" style="cursor: pointer; height: 100%; opacity: 0; filter:alpha(opacity=0); position: absolute; right: 0; top: 0; width: 100%; font-size: 1000px;">\
                                 </form>');
         this.$form = $triggerWrapper.find('form');
         this.$input = $triggerWrapper.find('input');
         if (!this.isHtml5) {
            var iframeName = 'upload_iframe_' + S4();
            this.$form.attr('target', iframeName);
            $('<input type="hidden" name="callback" value="uploadImage" />\
               <input type="hidden" name="type" value="'+ this.config.uploadType +'" />\
               <input type="hidden" value="'+ this.config.MIN_PICSIZE +'" name="minSize" />\
               <input type="hidden" value="'+ this.config.MAX_PICSIZE +'" name="maxSize" />\
               <input type="hidden" value="'+ this.config.isPrivate +'" name="isPrivate" />\
               <input type="submit" style="display: none;" />').appendTo(this.$form);
            $triggerWrapper.append('<iframe name="'+ iframeName +'" style="display: none;"></iframe>');
            this.$iframe = $triggerWrapper.find('iframe');
         }
      },

      initHtml5Upload: function () {
         this.$input.bind($.browser.msie? 'propertychange': 'change', $.proxy(this.onSelect, this));
      },

      initIframeUpload: function () {
         this.$input.bind('change', $.proxy(this.iframeSelect, this));
      },

      /**
       * 选择文件
       *
       * @method onSelect
       * @param {Event} evt 
       */
      onSelect: function (evt) {
         this.config.onSelect();
         var files = evt.originalEvent.target.files || evt.originalEvent.dataTransfer.files;
         this.file = files[0];
         var $clone = this.$input.clone().val('');
         this.$input.replaceWith($clone);
         $clone.bind('change', $.proxy(this.onSelect, this));
         this.$input = $clone;
         if (!this.file) {
            this.config.onSelectError({
               type: ''
            });
            return;
         } else if (this.uploading || !this.checkFile()) {
            return;
         }
         this.onUpload();
         this.$input.val(null); // fixed no trigger change Event by the select same files(chrome)
      },

      /**
       * 校验所上传文件
       *
       * @method checkFile
       */
      checkFile: function () {
         var file = this.file;
         var fileType = this.config.uploadType, checkReg;
         if (this.config.uploadType === 'image') {
            checkReg = Upload.REG_IMAGE_FORMAT;
         } else {
            checkReg = Upload.REG_VIDEO_FORMAT;
         }

         if (this.config.isCheckFileType && (file.type.indexOf(fileType) !== 0 || !checkReg.test(file.name))) {
            this.config.onSelectError({
               type: 'format'
            });
            return false;
         } else if (file.size < this.config.MIN_PICSIZE || file.size > this.config.MAX_PICSIZE) {
            this.config.onSelectError({
               type: 'size'
            });
            return false;
         }

         return true;
      },

      /**
       * 上传图片
       *
       * @method onUpload
       */
      onUpload: function () {
         var self = this, file = this.file;
         var xhr = new XMLHttpRequest();
         if (xhr.upload) {
            xhr.upload.addEventListener('progress', function(evt) {
               var percent = (evt.loaded / evt.total * 100).toFixed(1);
               percent = percent > 99 ? 100 : parseInt(percent);
               self.onProgress(percent);
            });
            xhr.onreadystatechange = function(evt) {
               if (xhr.readyState === 4) {
                  self.config.onLoaded();
                  self.uploading = false;
                  if (xhr.status === 200) {
                     self.onSuccess(xhr.responseText);
                  } else {
                     self.onError('500');
                  }
               }
            };
            
            xhr.open('POST', this.options.uploadUrl, true);
            var fileName = encodeURIComponent(file.name); /// fixed bug: Cannot convert string to ByteString because the character at index 0 has value 38647 which is greater than 255.
            xhr.setRequestHeader('X_FILENAME', fileName);
            var fd = new FormData();
            fd.append('image', file);
            this.uploading = true;
            xhr.send(fd);
         }
      },

      /**
       * 上传中
       *
       * @method onProgress
       */
      onProgress: function (percent) {
         this.config.onProgress(percent);
      },

      /**
       * 上传成功
       *
       * @method onSuccess
       */
      onSuccess: function (responseText) {
        console.log(responseText);
         var json = $.parseJSON(responseText);
         json.name = this.file.name;
         this.config.onSuccess(json);
      },

      /**
       * 上传失败
       *
       * @method onError
       */
      onError: function (type) {
         this.config.onError(type);
      },

      /**
       * 选择图片(ps: iframe模式)
       *
       * @method iframeSelect
       */
      iframeSelect: function () {
         this.config.onSelect();
         if (this.uploading) { return; }
         var fileVal = this.$input.val();
         if (fileVal === '') {
            this.config.onSelectError({
               type: 'size'
            });
            return;
         }
         var checkReg;
         if (this.config.uploadType === 'image') {
            checkReg = Upload.REG_IMAGE_FORMAT;
         } else {
            checkReg = Upload.REG_VIDEO_FORMAT;
         }
         if (!checkReg.test(fileVal)) {
            this.config.onSelectError({
               type: 'format'
            });
            return;
         }
         this.config.onLoading();
         this.iframeUpload();
      },

      /**
       * 开始上传(ps: iframe模式)
       *
       * @method iframeUpload
       */
      iframeUpload: function () {
         window.uploadCallback = $.proxy(this.uploadCallback, this);
         this.$form.find('input[name=callback]').val('uploadCallback');
         this.uploading = true;
         this.$form[0].submit();
      },

      /**
       * 上传完成回调
       *
       * @method uploadCallback
       * @param {Object} json
       */
      uploadCallback: function (json) {
         window.uploadCallback = undefined;
         this.uploading = false;
         this.config.onLoaded();
         json.name = this.$input.val().split('\\').pop();
         if (json && json.originalURL) {
            this.config.onSuccess(json);
            return;
         } else {
            this.config.onError(json);
         }
      }
   };

   window.Upload = Upload;
})();