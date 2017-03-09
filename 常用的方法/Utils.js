var Utils = {
   getLength: function(str) {
      // 两个英文或数字==一个长度
      return Math.ceil(str.replace(/[\uFE30-\uFFA0\u2E80-\u9FFF\uac00-\ud7ff\u3000]/g, "**").length / 2);
   },

   cutChars: function(str, len, flag) {
      // 截取字符串，flag==true加省略号
      var strLen = str.replace(/[\u4e00-\u9fa5\s]/g, "**").length, newStr = [], totalCount = 0;
      if (strLen <= len) {
         return str;
      } else {
         for (var i = 0; i < strLen; i++) {
            var nowValue = str.charAt(i);
            if (/[^\x00-\xff]/.test(nowValue)) {
               totalCount += 2;
            } else {
               totalCount += 1;
            }
            newStr.push(nowValue);
            if (totalCount >= len) {
               break;
            }
         }
         if (!flag) {
            return newStr.join("");
         } else {
            return newStr.join("") + "...";
         }
      }
   },

   encodeSpecialHtmlChar: function(str) {
      /**
       * 转义字符串中的特殊HTML符号
       * @function Utils.encodeSpecialHtmlChar
       * @param {String}str 要替换的字符串
       * @return {String}
       */
      if (str) {
         var codingchar = ["&", "<", ">", "\""];
         var sepchar = ["&amp;", "&lt;", "&gt;", "&quot;"];
         var len = sepchar.length;
         for (var i = 0; i < len; i++) {
            str = str.replace(new RegExp(codingchar[i], "g"), sepchar[i]);
         }
         return str;
      } else {
         return "";
      }
   },

   decodeSpecialHtmlChar: function(str) {
      /**
       * 反转义字符串中的特殊HTML符号
       * @function Utils.decodeSpecialHtmlChar
       * @param {String}str 要替换的字符串
       * @return {String}
       */
      if (str) {
         var codingchar = ["&amp;", "&lt;", "&gt;", "&quot;", "&#quot", "&#rmrow", "&#lmrow", "&apos;"];
         var sepchar = ["&", "<", ">", "\"", "'", "(", ")", "'"];
         var len = sepchar.length;
         for (var i = 0; i < len; i++) {
            str = str.replace(new RegExp(codingchar[i], "g"), sepchar[i]);
         }
         return str;
      } else {
         return "";
      }
   },

   getImageUrl : function(url, width, height, corp) {
      var width = width, url = url && url || '', tail = url.split('.')[1];
      var height = height || width;
      var quality = 85;
      var q = 1;
      if (!corp && corp == 0) {
         q = corp;
      }
      var src = '';
      if (url.match(/bobo-public.nosdn.127.net\//i)) {
         if(url.match(/imageView/i) && url.match(/thumbnail/i)) {
            src = url;
         } else {
            src = url + '?imageView&quality=' + quality + '&thumbnail=' + width + (q === 1 ? 'y' : 'x') + height;
         }
      } else {
         src = 'http://imgsize.ph.126.net/?imgurl=' + url + '_' + width + 'x' + height + 'x' + q + 'x' + quality + '.' + tail;
      }
      return src;
   },

   cache: {},

   parseTpl: function(selectorStr, data) {
      /**
       * @param {String}selectorStr 模板的节点选择器字符串
       * @param {String}data json数据
       * @return {String} 返回html字符串
       */
      var str = jQuery(selectorStr).html();
      var fn = !/\W/.test(str) ?
         Utils.cache[str] = Utils.cache[str] ||
         Utils.tmpl(str) :
         new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            "with(obj){p.push('" + str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'") + "');}return p.join('');");
      return data ? fn(data) : fn;
   },

   getUrlParam: function(name) {
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
          r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); 
      return null;
    }
};