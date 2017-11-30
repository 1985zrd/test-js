(function($) {
  function PreLoad (imgs, opts) {
    this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
    this.opts = $.extend({}, PreLoad.DEFAULTS, opts);
    if (this.opts.order === 'ordered') {
      this._ordered(); // 有序加载
    } else {
      this._unordered(); // 无序加载
    }
  }
  PreLoad.DEFAULTS = {
    order: 'unordered', //默认进行无序预加载
    each: null, // 单个图片加载完成后执行的方法
    all: null // 所有图片加载完成后执行的方法
  };

  PreLoad.prototype._ordered = function () { // 有序加载
    var imgs = this.imgs, len = imgs.length, count = 0, opts = this.opts;
    load();
    function load () {
      var img = new Image();
      $(img).on('load error', function() {
        opts.each && opts.each(count);
        if (count >= len) {
          // 所有图片加载完毕
          opts.all && opts.all();
        } else {
          load();
        }
        count++;
      });
      img.src = imgs[count];
    }
  };
  PreLoad.prototype._unordered = function() { // 无序加载
    var imgs = this.imgs, len = imgs.length, count = 0, opts = this.opts;
    imgs.forEach(function(elem) {
      var img = new Image();
      $(img).on('load error', function(){
         opts.each && opts.each(count);
        if (count >= len -1) {
          opts.all && opts.all();
        }
        count++;
      });
      img.src = elem;
    });
  };
  $.extend({
    preload: function(imgs, opts) {
      new PreLoad(imgs, opts);
    }
  });
})(jQuery);