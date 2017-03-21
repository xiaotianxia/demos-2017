function StarScore(conf) {
    this.config = {
        container: '',
        starClass: 's-star',
        ativeStarClass: 's-star_active',
        onClick: function() {}
    };
    this.index = 0;
    this.isClicked = false;
    this.config = $.extend(this.config, conf);
    

    this.$container = this.config.container;
    this.$stars = this.$container.find('.' + this.config.starClass);
    this.bindEvent();
}

StarScore.prototype.bindEvent = function() {
    this.$container.delegate('.star-trigger', 'mouseover', $.proxy(this.onMouseover, this));
    this.$container.delegate('.star-trigger', 'click', $.proxy(this.onClick, this));
    this.$container.on('mouseout', $.proxy(this.onMouseout, this));
}

StarScore.prototype.onMouseover = function(evt) {
    var $target = $(evt.currentTarget),
        index = this.$stars.index($target);
    this.index = index;
    for(var i = 0; i <= index; i ++) {
        this.$stars.eq(i).addClass(this.config.ativeStarClass);
    }
    for(var j = index + 1, len = this.$stars.length; j <= len - 1; j ++) {
        this.$stars.eq(j).removeClass(this.config.ativeStarClass);
    }
}

StarScore.prototype.onMouseout = function() {
    if(this.isClicked) { return; }
    this.$stars.removeClass(this.config.ativeStarClass);
}

StarScore.prototype.onClick = function() {
    this.isClicked = true;
    this.config.onClick(this.index);
}