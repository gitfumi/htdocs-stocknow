(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _add_tap_class = require('./module/add_tap_class.js');

var _add_tap_class2 = _interopRequireDefault(_add_tap_class);

var _current_link = require('./module/current_link.js');

var _current_link2 = _interopRequireDefault(_current_link);

var _disable_tel_link = require('./module/disable_tel_link.js');

var _disable_tel_link2 = _interopRequireDefault(_disable_tel_link);

var _glovalnav = require('./module/glovalnav.js');

var _glovalnav2 = _interopRequireDefault(_glovalnav);

var _magnific_popup = require('./module/magnific_popup.js');

var _magnific_popup2 = _interopRequireDefault(_magnific_popup);

var _popup = require('./module/popup.js');

var _popup2 = _interopRequireDefault(_popup);

var _scroll_anchor = require('./module/scroll_anchor.js');

var _scroll_anchor2 = _interopRequireDefault(_scroll_anchor);

var _scroll_header_effect = require('./module/scroll_header_effect.js');

var _scroll_header_effect2 = _interopRequireDefault(_scroll_header_effect);

var _toggle = require('./module/toggle.js');

var _toggle2 = _interopRequireDefault(_toggle);

var _toggle_category = require('./module/toggle_category.js');

var _toggle_category2 = _interopRequireDefault(_toggle_category);

var _on_media_query = require('./on_media_query.js');

var _on_media_query2 = _interopRequireDefault(_on_media_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./module/add_tap_class.js":2,"./module/current_link.js":3,"./module/disable_tel_link.js":4,"./module/glovalnav.js":5,"./module/magnific_popup.js":6,"./module/popup.js":8,"./module/scroll_anchor.js":9,"./module/scroll_header_effect.js":10,"./module/toggle.js":11,"./module/toggle_category.js":12,"./on_media_query.js":13}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// タッチデバイスで:hoverを再現
var addTapClass = function () {
	$(document).on(window.ontouchstart === null ? 'touchstart' : 'mouseenter', 'a, button, .js-hover', function () {
		$(this).addClass('is-hover');
	}).on(window.ontouchend === null ? 'touchend' : 'mouseleave', 'a, button, .js-hover', function () {
		var self = this;
		setTimeout(function () {
			$(self).removeClass('is-hover');
		}, 100);
	});
}();
exports.default = addTapClass;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// コンテンツの表示、非表示
var currentLink = function () {
	return {
		Uri: function Uri(path) {
			var self = this;
			this.originalPath = path;
			//絶対パスを取得
			this.absolutePath = function () {
				var e = document.createElement('span');
				e.innerHTML = '<a href="' + path + '" />';
				return e.firstChild.href;
			}();
			//絶対パスを分解
			var fields = { 'schema': 2, 'username': 5, 'password': 6, 'host': 7, 'path': 9, 'query': 10, 'fragment': 11 };
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
exports.default = currentLink;

currentLink.selflink();

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ua = require('../ua.js');

var _ua2 = _interopRequireDefault(_ua);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var disableTelLink = function () {
	if (!_ua2.default.Mobile) {
		$('a[href^="tel:"]').on('click', function (e) {
			e.preventDefault();
		});
	}
}(); // モバイル端末以外はtelリンクを無効
exports.default = disableTelLink;

},{"../ua.js":14}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
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
exports.default = globalNav;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// モーダル表示
var magnificPopup = function () {
	$('.js-magnificPopupSingle').magnificPopup({
		delegate: 'a',
		type: 'image',
		zoom: {
			enabled: true,
			duration: 300
		}
	});
	$('.js-magnificPopupGallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true,
			duration: 300
		}
	});
	$('.js-magnificPopupIframe').magnificPopup({
		delegate: 'a',
		type: 'iframe',
		zoom: {
			enabled: true,
			duration: 300
		}
	});
	$('.js-magnificPopupInline').magnificPopup({
		delegate: 'a',
		type: 'inline',
		zoom: {
			enabled: true,
			duration: 300
		}
	});
}();
exports.default = magnificPopup;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _valiable = require('../valiable.js');

var _valiable2 = _interopRequireDefault(_valiable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var menuDrawer = function menuDrawer() {
	var $window = $window;
	var $body = $('body');
	var $header = $('#header');
	var $globalNav = $('#headerNav');
	var $globalCat = $('#headerCat');
	var $globalSub = $('#headerSub');
	var $cloneGNav = $globalNav.clone(true);
	var $cloneCNav = $globalCat.clone(true);
	var $cloneSNav = $globalSub.clone(true);
	$body.append(['<div id="drawerMenu"><div id="drawerMenuInner"></div></div>', '<div id="drawerMenuOverlay"></div>', '<div id="btnDrawerMenuClose"><p><span><span></p></div>'].join(''));
	$cloneGNav.appendTo('#drawerMenuInner').attr('id', 'drawerNav').find('.navLogo').remove();
	$header.append('<div id="btnMenu03"><p><span class="icoMenu"><span class="icoMenuInner"></span></span></p></div>');
	var scrollY;
	var $drawerMenu = $('#drawerMenu');
	var $drawerMenuInner = $('#drawerMenuInner');
	var $drawerMenuOverlay = $('#drawerMenuOverlay');
	var $btnDrawerMenuClose = $('#btnDrawerMenuClose');

	// 「Menu」テキストの追加
	$drawerMenuInner.prepend('<p id="drawerTtl">MENU</p>');

	// 「category」の追加
	$cloneCNav.appendTo($drawerMenuInner).attr('id', 'drawerCat').removeClass('js-toggleCat_t').show();
	// 「Sub Menu」の追加
	$cloneSNav.appendTo($drawerMenuInner).attr('id', 'drawerSub');

	// 開く
	$('#btnMenu03').on('click', function () {
		scrollY = $(window).scrollTop();
		_valiable2.default.isMenuShow = true;
		$body.css({
			'position': 'fixed',
			'top': '-' + scrollY + 'px',
			'left': 0,
			'width': '100%'
		});
		$drawerMenu.removeClass('is-hide').addClass('is-show');
		$drawerMenuOverlay.addClass('is-show');
		$btnDrawerMenuClose.addClass('is-show');
	});

	// 閉じる
	$('#drawerMenuOverlay, #btnDrawerMenuClose').on('click', function () {
		$body.removeAttr('style');
		$drawerMenu.removeClass('is-show').addClass('is-hide');
		$drawerMenuOverlay.removeClass('is-show');
		$btnDrawerMenuClose.removeClass('is-show');
		$('html, body').prop({ scrollTop: scrollY });
	});
}; // ドロワーメニュー
exports.default = menuDrawer;

},{"../valiable.js":15}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// カスタムデータ属性にウィンドウネーム、横幅、縦幅を指定可能（省略可）。
// HTML記述サンプル
// <a href="#" class="js-popup" data-name="popup" data-width="800" data-height="500">ポップアップ</a>
// <a href="#" class="js-popup">ポップアップ</a>
var popup = function () {
	var $popup = $('.js-popup');
	$popup.each(function () {
		var $self = $(this);
		$self.on('click', function () {
			var url = $(this).attr('href');
			var windowName = $(this).data('name');
			var width = $(this).data('width');
			var height = $(this).data('height');
			if (!windowName) windowName = 'popup';
			if (!width) var width = window.innerWidth || document.documentElement.clientWidth;
			if (!height) var height = window.innerHeight || document.documentElement.clientHeight;
			var option = 'menubar=no, titlebar=no, toolbar=no, location=no, status=no, scrollbars=yes, resizable=no';
			var x = (screen.availWidth - width) / 2;
			var y = (screen.availHeight - height) / 2;
			var o = option + ', width=' + width + ', height=' + height + ', left=' + x + ', top=' + y;
			var blockMessage = 'ウィンドウがお使いのブラウザでポップアップブロックされました\nポップアップブロックを解除してください';
			var win = window.open(url, windowName, o);
			if (win) {
				win.focus();
			} else {
				alert(blockMessage);
			}
			return false;
		});
	});
}();
exports.default = popup;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// 指定のアンカー要素までスクロール
var scrollAnchor = function () {
	var $win = $(window);
	var $doc = $(document);
	var $scrollElement = getFirstScrollable('html,body');
	var mousewheel = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	var SCROLL_SPEED = 800;
	var SCROLL_EASING = 'easeOutQuint';
	var NO_SCROLL_CLASS = 'js-noScroll';
	var PAGE_TOP_HASH = '#top';
	// aタグのクリック
	$doc.on('click', 'a[href^="#"]', function (e) {
		var $self = $(this);
		var target = this.hash;
		var top = void 0;
		var headerHeight = void 0;
		// リンク先が#topの場合
		if (target == PAGE_TOP_HASH) {
			// ページの先頭へスクロール
			top = 0;
		}
		// リンク先が#topではない場合
		else {
				// 指定した要素が存在しない場合、a要素にclass（js-noScroll）を指定してた場合は未処理とする
				if ($(target).length < 1 || $self.hasClass(NO_SCROLL_CLASS)) return false;
				// スクロール先の座標を調整する
				headerHeight = $('#header').outerHeight();
				if ($('#header').hasClass('is-short')) {
					headerHeight = headerHeight + 20;
				} else {
					headerHeight = headerHeight - 20;
				}
				top = $(target).offset().top - headerHeight;
				top = Math.min(top, $doc.height() - $win.height());
			}
		// ウィールイベントをキャンセルしておく
		$doc.on(mousewheel, function (e) {
			e.preventDefault();
		});
		// アニメーションの実行
		$scrollElement.stop().animate({ scrollTop: top }, SCROLL_SPEED, SCROLL_EASING, function () {
			$doc.off(mousewheel);
		});
		return false;
	});
	// htmlとbody、どちらかスクロール可能な要素を取得
	function getFirstScrollable(selector) {
		var $scrollable = void 0;
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
}();
exports.default = scrollAnchor;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// 上にスクロールで表示

var scrollHeaderEffect = function () {
	var $window = $(window);
	var $header = $('#header');
	var headerHeight = $header.height();
	var SHOW_POSITION = 200;

	$window.on('scroll.scrollEffectCommon', function () {
		var currentPostion = $(this).scrollTop();

		if (currentPostion > headerHeight) {
			$header.addClass('is-short');
		} else {
			$header.removeClass('is-short');
		}
	});
}();
exports.default = scrollHeaderEffect;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// コンテンツの表示、非表示
var toggle = function () {
	var $toggleBtn = $('.js-toggle_btn');
	$toggleBtn.each(function () {
		var $self = $(this);
		var $toggleBody = $self.next();
		var SLIDE_DOWN_SPEED = 300;
		var SLIDE_UP_SPEED = 300;
		// 現在ページだったら開く
		if ($self.hasClass('is-current')) {
			$self.addClass('is-show');
		}
		// 現在ページじゃなければ閉じる
		else {
				$self.addClass('is-hide');
				$toggleBody.hide();
			}
		$self.on('click', function () {
			// 開いていたら
			if ($self.hasClass('is-show')) {
				$self.removeClass('is-show is-current').addClass('is-hide');
				$toggleBody.not(':animated').slideUp(SLIDE_UP_SPEED);
			}
			// 閉じていたら
			else {
					$self.removeClass('is-hide').addClass('is-show');
					$toggleBody.not(':animated').slideDown(SLIDE_DOWN_SPEED);
				}
		});
	});
}();
exports.default = toggle;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// コンテンツの表示、非表示
var toggoleCategory = function () {
	var $togglePoint = $('.js-toggleCat_p');
	var $toggleTarget = $('.js-toggleCat_t');
	var $closeBtn = $('.js-toggleClose');
	var SLIDE_DOWN_SPEED = 300;
	var SLIDE_UP_SPEED = 300;

	// 現在ページだったら開く
	if ($togglePoint.hasClass('is-current')) {
		$togglePoint.addClass('is-show');
	}
	// 現在ページじゃなければ閉じる
	else {
			$togglePoint.addClass('is-hide');
			$toggleTarget.hide();
		}

	$togglePoint.on('click', function () {
		var $self = $(this);
		// 開いていたら
		if ($self.hasClass('is-show')) {
			$self.removeClass('is-show is-current').addClass('is-hide');
			$toggleTarget.not(':animated').slideUp(SLIDE_UP_SPEED);
		}
		// 閉じていたら
		else {
				$self.removeClass('is-hide').addClass('is-show');
				$toggleTarget.not(':animated').slideDown(SLIDE_DOWN_SPEED);
			}
	});
	$closeBtn.on('click', function () {
		var $self = $togglePoint;
		$self.removeClass('is-show is-current').addClass('is-hide');
		$toggleTarget.not(':animated').slideUp(SLIDE_UP_SPEED);
	});
}();
exports.default = toggoleCategory;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _menu_drawer = require('./module/menu_drawer.js');

var _menu_drawer2 = _interopRequireDefault(_menu_drawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import menuFloating  from './module/menu_floating.js';
// import menuSlide     from './module/menu_slide.js';
var onMediaQuery = function () {
	var $window = $(window);
	var $body = $('body');
	var $header = $('#header');
	// let $main   = $('#main');
	var breadcrumbsScroll = void 0;
	var queries = [{
		context: ['pc', 'minipc'],
		match: function match() {
			// scrollEffect.common();
			// scrollEffect.pc();
		},
		unmatch: function unmatch() {
			// $window.off('scroll.scrollEffectPC');
			// $('.m-h1').removeClass('is-hidden');
			// $('.cloneH1').remove();
		}
	}, {
		context: ['tablet', 'phablet', 'sp'],
		match: function match() {
			(0, _menu_drawer2.default)();
			// scrollEffect.common();
			// scrollEffect.sp();
			// menuFloating();
			// menuSlide();
			// $main.css('padding-top', $header.height());
			// $(window).on('load', function() {
			// 	$main.css('padding-top', $header.height());
			// });
		},
		unmatch: function unmatch() {
			// if(menuFlg){
			// 	console.log('unmatch');
			// 	menuFlg = true;
			// }
			$(window).off('scroll.scrollEffectSP');
			$body.removeAttr('style');
			// $header.removeClass();
			// $header.removeAttr('style');
			// $main.removeAttr('style');
			// $('#btnMenu').remove();
			// $('#btnMenu02').remove();
			$('#btnMenu03').remove();
			// $('#btnMenu04').remove();
			// $('#slideMenu').remove();
			// $('#floatingMenu').remove();
			$('#drawerMenu').remove();
			$('#drawerMenuOverlay').remove();
			$('#btnDrawerMenuClose').remove();
			// $('#drawerMenu02').remove();
		}
	}, {
		context: ['phablet', 'sp'],
		match: function match() {
			// replaceSrc('_pc', '_sp');
		},
		unmatch: function unmatch() {
			// replaceSrc('_sp', '_pc');
		}
	}];
	MQ.init(queries);
}(); // メディアクエリでjsを切り替え
// import replaceSrc    from './module/replase_src.js';
// import scrollEffect  from './module/scroll_effect.js';
exports.default = onMediaQuery;

},{"./module/menu_drawer.js":7}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
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
exports.default = ua;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
// 共通変数
var valiable = function () {
	return {
		isMenuShow: false
	};
}();
exports.default = valiable;

},{}]},{},[1]);
