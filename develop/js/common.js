(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _current_link = _interopRequireDefault(require("./module/current_link.js"));

var _disable_tel_link = _interopRequireDefault(require("./module/disable_tel_link.js"));

var _glovalnav = _interopRequireDefault(require("./module/glovalnav.js"));

var _scroll_anchor = _interopRequireDefault(require("./module/scroll_anchor.js"));

var _perfect_scroll = _interopRequireDefault(require("./module/perfect_scroll.js"));

var _menu_slide = _interopRequireDefault(require("./module/menu_slide.js"));

var _ga_event_tracking = _interopRequireDefault(require("./module/ga_event_tracking.js"));

var _on_media_query = _interopRequireDefault(require("./on_media_query.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./module/current_link.js":2,"./module/disable_tel_link.js":3,"./module/ga_event_tracking.js":4,"./module/glovalnav.js":5,"./module/menu_slide.js":6,"./module/perfect_scroll.js":7,"./module/scroll_anchor.js":8,"./on_media_query.js":9}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// コンテンツの表示、非表示
var currentLink = function () {
  return {
    Uri: function Uri(path) {
      var self = this;
      this.originalPath = path; //絶対パスを取得

      this.absolutePath = function () {
        var e = document.createElement('span');
        e.innerHTML = '<a href="' + path + '" />';
        return e.firstChild.href;
      }(); //絶対パスを分解


      var fields = {
        'schema': 2,
        'username': 5,
        'password': 6,
        'host': 7,
        'path': 9,
        'query': 10,
        'fragment': 11
      };
      var r = /^((\w+):)?(\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/.exec(this.absolutePath);

      for (var field in fields) {
        this[field] = r[fields[field]];
      }

      this.querys = {};

      if (this.query) {
        $.each(self.query.split('&'), function () {
          var a = this.split('=');
          if (a.length == 2) self.querys[a[0]] = a[1];
        });
      }
    },
    selflink: function selflink(options) {
      var c = $.extend({
        selfLinkAreaSelector: 'body',
        selfLinkClass: 'is-current',
        parentsLinkClass: 'is-current',
        postfix: '_on',
        changeImgSelf: false,
        changeImgParents: false
      }, options);
      $(c.selfLinkAreaSelector + (c.selfLinkAreaSelector ? ' ' : '') + 'a[href]').each(function () {
        var href = new currentLink.Uri(this.getAttribute('href'));
        var setImgFlg = false;

        if (href.absolutePath == location.href && !href.fragment) {
          //同じ文書にリンク
          $(this).addClass(c.selfLinkClass);
          setImgFlg = c.changeImgSelf;
        } else if (0 <= location.href.search(href.absolutePath)) {
          //親ディレクトリリンク
          $(this).addClass(c.parentsLinkClass);
          setImgFlg = c.changeImgParents;
        }

        if (setImgFlg) {
          //img要素が含まれていたら現在用画像（_cr）に設定
          $(this).find('img').each(function () {
            this.originalSrc = $(this).attr('src');
            this.currentSrc = this.originalSrc.replace(new RegExp('(' + c.postfix + ')?(\.gif|\.jpg|\.png)$'), c.postfix + "$2");
            $(this).attr('src', this.currentSrc);
          });
        }
      });
    }
  };
}();

var _default = currentLink;
exports.default = _default;
currentLink.selflink();

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ua = _interopRequireDefault(require("../ua.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// モバイル端末以外はtelリンクを無効
var disableTelLink = function () {
  if (!_ua.default.Mobile) {
    $('a[href^="tel:"]').on('click', function (e) {
      e.preventDefault();
    });
  }
}();

var _default = disableTelLink;
exports.default = _default;

},{"../ua.js":10}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// googleのイベントトラッキング
var gaEventTracking = function () {
  $('.js-gaEventTracking a').on('click', function (event) {
    event.preventDefault();
    var data = $(this).parent().data();
    console.log('gaGroup:' + data.gaGroup);
    console.log('gaAction:' + data.gaAction);
    console.log('gaLabel:' + data.gaLabel);
    console.log('gaCount:' + data.gaCount); // ga('send','event',data.gaGroup,data.gaAction,data.gaLabel, data.gaCount);
  });
}();

var _default = gaEventTracking;
exports.default = _default;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// グローバルナビゲーションの表示、非表示
var globalNav = function () {
  if ($('#globalNav').length) {
    var $globalNav = $('#globalNav');
    var $cat = $globalNav.find('span');
    var currentCat = '.is-' + $('body').attr('class').replace('p-', '');
    $globalNav.find(currentCat).addClass('is-show').children('ul').show();
    $cat.on('click', function () {
      var $self = $(this);
      var $target = $self.parent().children('ul');

      if ($target.is(':visible')) {
        $target.slideUp();
        $self.parent().removeClass('is-show');
      } else {
        $target.slideDown();
        $self.parent().addClass('is-show');
      }
    });
  }
}();

var _default = globalNav;
exports.default = _default;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _valiable = _interopRequireDefault(require("../valiable.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// スライドメニュー
var menuSlide = function menuSlide() {
  var $body = $('body');
  var $header = $('.header_logo');
  var $headerNav = $('.header_inner');
  var $contents = $('#contents'); // var $globalNav    = $('.footer_menu nav');
  // var $globalSuvNav = $('.header_subMenu');
  // var $asideSns     = $('.asideMenu .c-sns');

  var headerHeight = $header.outerHeight(); // var $cloneNav     = $globalNav.clone(true);
  // var $cloneSuvNav  = $globalSuvNav.clone(true);
  // var $cloneSns     = $asideSns.clone(true);
  // $body.append('<div id="slideMenu"></div>');
  // $cloneSuvNav.appendTo('#slideMenu').find('.this-logo').remove();
  // $cloneNav.appendTo('#slideMenu');
  // $('<div class="weather js-weather"></div>').appendTo('#slideMenu');
  // $cloneSns.appendTo('#slideMenu');

  $header.append('<div id="btnMenu"><p><span class="icoMenu"><span class="icoMenuInner"></span></span></p></div>');
  var $slideMenu = $('#slideMenu');
  var slideMenuHeight = $slideMenu.height();
  var scrollY;
  $slideMenu.css('top', headerHeight);
  hideSlideMenu();
  $('#btnMenu').on('click', function () {
    $(this).children().toggleClass('is-active');

    if ($headerNav.hasClass('is-show')) {
      hideSlideMenu();
    } else {
      showSlideMenu();
    }
  }); // 開く

  function showSlideMenu() {
    scrollY = $(window).scrollTop();
    _valiable.default.isMenuShow = true;
    $headerNav.removeClass('is-hide').addClass('is-show');
    $contents.removeClass('is-hide').addClass('is-show');
  } // 閉じる


  function hideSlideMenu() {
    $headerNav.removeClass('is-show').addClass('is-hide');
    $contents.removeClass('is-show').addClass('is-hide');
    $body.removeAttr('style');
    $('html, body').prop({
      scrollTop: scrollY
    });
  }
};

var _default = menuSlide;
exports.default = _default;

},{"../valiable.js":11}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// グローバルナビゲーションの表示、非表示
var perfectScrollbar = function () {
  if ($('#js-perfectScrollbar').length) {
    var ps = new PerfectScrollbar('#js-perfectScrollbar');
  }
}();

var _default = perfectScrollbar;
exports.default = _default;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ua = _interopRequireDefault(require("../ua.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 指定のアンカー要素までスクロール
var scrollAnchor = function scrollAnchor(device) {
  var $win = $(window);
  var $doc = $(document);
  var $scrollElement = getFirstScrollable('html,body');
  var mousewheel = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
  var SCROLL_SPEED = 800;
  var SCROLL_EASING = 'easeOutQuint';
  var NO_SCROLL_CLASS = 'js-noScroll';
  var PAGE_TOP_HASH = '#top';
  var phabletHeight; // aタグのクリック

  $doc.on('click', 'a[href^="#"]', function (e) {
    var $self = $(this);
    var target = this.hash;
    var top;
    var headerHeight; // リンク先が#topの場合

    if (target == PAGE_TOP_HASH || !target) {
      // ページの先頭へスクロール
      top = 0;
    } // リンク先が#topではない場合
    else {
        // 指定した要素が存在しない場合、a要素にclass（js-noScroll）を指定してた場合は未処理とする
        if ($(target).length < 1 || $self.hasClass(NO_SCROLL_CLASS)) return false; // // スクロール先の座標を調整する
        // headerHeight = $('#header').outerHeight();
        // if($('#header').hasClass('is-short')){
        // 	headerHeight = headerHeight + 20;
        // }else{
        // 	headerHeight = headerHeight - 20;
        // }
        // top = $(target).offset().top - headerHeight;

        console.log(device);

        if (device == 'phablet') {
          top = $(target).offset().top - $('.header_logo').height();
        } else {
          top = $(target).offset().top;
        }

        top = Math.min(top, $doc.height() - $win.height());
      } // ウィールイベントをキャンセルしておく


    $doc.on(mousewheel, function (e) {
      e.preventDefault();
    }); // アニメーションの実行

    $scrollElement.stop().animate({
      scrollTop: top
    }, SCROLL_SPEED, SCROLL_EASING, function () {
      $doc.off(mousewheel);
    });
    return false;
  }); // htmlとbody、どちらかスクロール可能な要素を取得

  function getFirstScrollable(selector) {
    var $scrollable;
    $(selector).each(function () {
      var $self = $(this);

      if ($self.scrollTop() > 0) {
        $scrollable = $self;
        return false;
      } else {
        $self.scrollTop(1);

        if ($self.scrollTop() > 0) {
          $scrollable = $self;
          return false;
        }

        $self.scrollTop(0);
      }
    });
    return $scrollable;
  }
};

var _default = scrollAnchor;
exports.default = _default;

},{"../ua.js":10}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _menu_slide = _interopRequireDefault(require("./module/menu_slide.js"));

var _scroll_anchor = _interopRequireDefault(require("./module/scroll_anchor.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// メディアクエリでjsを切り替え
var onMediaQuery = function () {
  var $window = $(window);
  var $body = $('body');
  var $header = $('#header');
  var breadcrumbsScroll;
  var queries = [{
    context: ['pc', 'minipc'],
    match: function match() {
      (0, _scroll_anchor.default)('pc');
    },
    unmatch: function unmatch() {}
  }, {
    context: ['tablet', 'phablet', 'sp'],
    match: function match() {
      (0, _scroll_anchor.default)('phablet');
      (0, _menu_slide.default)();
    },
    unmatch: function unmatch() {
      $(window).off('scroll.scrollEffectSP');
      $body.removeAttr('style');
      $('#btnMenu').remove();
      $('#drawerMenu').remove();
      $('#drawerMenuOverlay').remove();
      $('#btnDrawerMenuClose').remove();
    }
  }, {
    context: ['phablet', 'sp'],
    match: function match() {},
    unmatch: function unmatch() {}
  }];
  MQ.init(queries);
}();

var _default = onMediaQuery;
exports.default = _default;

},{"./module/menu_slide.js":6,"./module/scroll_anchor.js":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// ユーザーエージェントを取得
var ua = function () {
  return {
    ltIE7: typeof window.addEventListener == "undefined" && typeof document.querySelectorAll == "undefined",
    ltIE8: typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined",
    ltIE9: !(typeof history.pushState === "function") && document.uniqueID,
    gtIE10: document.uniqueID && window.matchMedia,
    IE: document.uniqueID,
    Firefox: window.sidebar,
    Opera: window.opera,
    Webkit: !document.uniqueID && !window.opera && !window.sidebar && window.localStorage && typeof window.orientation == "undefined",
    Mobile: typeof window.orientation != "undefined",
    iPad: navigator.userAgent.indexOf('iPad') > 0,
    iPhone: navigator.userAgent.indexOf('iPhone') > 0,
    iPod: navigator.userAgent.indexOf('iPod') > 0,
    androidTablet: navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') == -1,
    androidPhone: navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0
  };
}();

var _default = ua;
exports.default = _default;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// 共通変数
var valiable = function () {
  return {
    isMenuShow: false
  };
}();

var _default = valiable;
exports.default = _default;

},{}]},{},[1]);
