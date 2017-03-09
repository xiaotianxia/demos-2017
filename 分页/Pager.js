function Pager(opts) {
    this.options = {
        size: 15,
        maxButtons: 9,
        itemCount: 0,
        index: 1,
        pageCount: 1,
        nextText: 'next',
        prevText: 'prev',
    };
    this.container = null;
    this._start = 1;
    this._end = 1;
    this.options.pageCount = Math.ceil(this.options.itemCount / this.options.size); // 总页数
    for (var o in opts) {
        this.options[o] = opts[o];
    };
    this.staticDataCollection = [];
}

/**
* 点击分页的执行函数（外部重写）
* method onclick
* @index{int}页码
*/
Pager.prototype.onclick = function() {
    return true;
}

/**
* 点击分页的执行函数
* method _onclick
* @index{int}页码
*/
Pager.prototype._onclick = function(index) {
    var old = this.options.index;
    this.options.index = index;
    if (this.onclick(index) !== false) {
       this.render(this.wraperId);
    } else {
       this.options.index = old;
    }
}

/**
* 分页规则
* method _calculate
*/
Pager.prototype._calculate = function(index) {
    this.options.pageCount = parseInt(Math.ceil(this.options.itemCount / this.options.size));
    this.options.index = parseInt(this.options.index);
    if (this.options.index > this.options.pageCount) {
       this.options.index = this.options.pageCount;
    }
    if (this.options.index < 1) {
       this.options.index = 1;
    }
    this._start = Math.max(1, this.options.index - parseInt(this.options.maxButtons / 2));
    this._end = Math.min(this.options.pageCount, this._start + this.options.maxButtons - 1);
    this._start = Math.max(1, this._end - this.options.maxButtons + 1);
}

Pager.prototype.page = function(rows) {
    this._calculate();
    var s_num = (this.index - 1) * this.options.size;
    var e_num = this.index * this.options.size;
    return rows.slice(s_num, e_num);
}

Pager.prototype.render = function(pagerWraper) {
    this.wraperId = pagerWraper;
    this.container = pagerWraper;
    this._calculate();
    if (this.options.pageCount <= 1) {
        this.container.innerHTML = '';
        return;
    };
    var str = '<p class="page">';
    if (this.options.pageCount > 1) {
        if (this.options.index != 1) {
          str += '<a href="javascript://' + (this.options.index - 1) + '" title="' +  this.options.prevText + '" class="page-pre">' + this.options.prevText + '</a>';
        } else {
          str += '';
        }
    };
    if (this._start > 1) {
        str += ' <a href="javascript://1">1</a>';
        if (this._start > 2) {
            str += '...';
        }
    };
    for (var i = this._start; i <= this._end; i++) {
        if (i == this.options.index) {
            if (i == 1 && this.options.pageCount == 1) {
                str += '';
            } else {
                str += ' <span class="page-cur">' + i + '</span>';
            };
        } else {
            str += ' <a href="javascript://' + i + '">' + i + '</a>';
        }
    };
    if (this._end < this.options.pageCount) {
        if (this._end < this.options.pageCount - 1) {
            str += '...';
        }
        str += ' <a href="javascript://' + this.options.pageCount + '">' + this.options.pageCount + '</a>';
    };
    if (this.options.pageCount > 1) {
        if (this.options.index != this.options.pageCount) {
            str += '<a href="javascript://' + (this.options.index + 1) + '" class="page-next" title="' + this.options.nextText + '">' + this.options.nextText + '</a>';
        } else {
            str += '';
        }
    };
    str += "</p>"
    this.container.innerHTML = str;
    this.bind();
}

/**
* 绑定事件
* method bind
*/
Pager.prototype.bind = function() {
    var a_list = this.container.getElementsByTagName('a');
    var t = this;
    for (var i = 0; i < a_list.length; i++) {
        a_list[i].onclick = function() {
            var index = this.getAttribute('href');
            if (index != undefined && index != '') {
                index = parseInt(index.replace('javascript://', ''));
                t._onclick(index);
            }
            return false;
        };
    };
}

/**
* 静态数据分页
* method getStaticData
* @index{int}页码
*/
Pager.prototype.getStaticData = function(index) {
    var collection = [];
    if(this.options.size > this.staticDataCollection.length) {
        return this.staticDataCollection;
    } else if(index > this.options.pageCount) {
        return [];
    } else if (index <= this.options.pageCount) {
       for (var i = 0; i < this.staticDataCollection.length; i++) {
          for (var j = 0; j < this.options.size; j++) {
             if (i == (index - 1) * this.options.size + j) {
                collection.push(this.staticDataCollection[i]);
             }
          }
       }
       return collection;
    }
}

Pager.prototype.changeIndex = function(index) {
    this.options.index = index;
    this.render(this.wraperId);
}


//var pager=new Pager({itemCount:100, size:10})
//pager.onclick=function(index){}
//pager.render(pagerwraper)