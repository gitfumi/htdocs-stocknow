(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _add_tap_class = require('./module/add_tap_class.js');

var _add_tap_class2 = _interopRequireDefault(_add_tap_class);

var _box_link = require('./module/box_link.js');

var _box_link2 = _interopRequireDefault(_box_link);

var _current_link = require('./module/current_link.js');

var _current_link2 = _interopRequireDefault(_current_link);

var _disable_tel_link = require('./module/disable_tel_link.js');

var _disable_tel_link2 = _interopRequireDefault(_disable_tel_link);

var _glovalnav = require('./module/glovalnav.js');

var _glovalnav2 = _interopRequireDefault(_glovalnav);

var _img_liquid = require('./module/img_liquid.js');

var _img_liquid2 = _interopRequireDefault(_img_liquid);

var _magnific_popup = require('./module/magnific_popup.js');

var _magnific_popup2 = _interopRequireDefault(_magnific_popup);

var _match_height = require('./module/match_height.js');

var _match_height2 = _interopRequireDefault(_match_height);

var _on_portrait_change = require('./module/on_portrait_change.js');

var _on_portrait_change2 = _interopRequireDefault(_on_portrait_change);

var _popup = require('./module/popup.js');

var _popup2 = _interopRequireDefault(_popup);

var _replase_src = require('./module/replase_src.js');

var _replase_src2 = _interopRequireDefault(_replase_src);

var _rollover = require('./module/rollover.js');

var _rollover2 = _interopRequireDefault(_rollover);

var _scroll_anchor = require('./module/scroll_anchor.js');

var _scroll_anchor2 = _interopRequireDefault(_scroll_anchor);

var _scroll_table = require('./module/scroll_table.js');

var _scroll_table2 = _interopRequireDefault(_scroll_table);

var _tab = require('./module/tab.js');

var _tab2 = _interopRequireDefault(_tab);

var _toggle = require('./module/toggle.js');

var _toggle2 = _interopRequireDefault(_toggle);

var _on_media_query = require('./on_media_query.js');

var _on_media_query2 = _interopRequireDefault(_on_media_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./module/add_tap_class.js":2,"./module/box_link.js":3,"./module/current_link.js":4,"./module/disable_tel_link.js":5,"./module/glovalnav.js":6,"./module/img_liquid.js":7,"./module/magnific_popup.js":8,"./module/match_height.js":9,"./module/on_portrait_change.js":13,"./module/popup.js":14,"./module/replase_src.js":15,"./module/rollover.js":16,"./module/scroll_anchor.js":17,"./module/scroll_table.js":19,"./module/tab.js":20,"./module/toggle.js":21,"./on_media_query.js":22}],2:[function(require,module,exports){
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
// ボックス全体をリンク
var boxLink = function () {
	var $boxLink = $('.js-boxLink');
	$boxLink.each(function () {
		var $self = $(this);
		$self.css('cursor', 'pointer').on({
			mouseenter: function mouseenter() {
				$self.addClass('is-hover');
			},
			mouseleave: function mouseleave() {
				$self.removeClass('is-hover');
			}
		});
		$self.on('click', function () {
			var url = $self.find('a').attr('href');
			$self.addClass('is-hover');
			if ($(this).find('a').attr('target') === '_blank') {
				window.open(url);
			} else {
				window.location = url;
			}
			return false;
		});
	});
}();
exports.default = boxLink;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"../ua.js":23}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// 親要素に収まるように画像をリサイズ
var imgLiquid = function () {
	$('.js-imgLiquid').imgLiquid();
}();
exports.default = imgLiquid;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// ブロック要素の高さを行ごとに揃える
var matchHeight = function () {
	$(window).on('load', function () {
		$('.js-matchHeight').matchHeight();
	});
}();
exports.default = matchHeight;

},{}],10:[function(require,module,exports){
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
	var $globalNav = $('#globalNav');
	var $cloneNav = $globalNav.clone(true);
	$body.append(['<div id="drawerMenu"></div>', '<div id="drawerMenuOverlay"></div>', '<div id="btnDrawerMenuClose"><p><span><span></p></div>'].join(''));
	$cloneNav.appendTo('#drawerMenu');
	$header.append('<div id="btnMenu03"><p><span class="icoMenu"><span class="icoMenuInner"></span></span></p></div>');
	var scrollY;
	var $drawerMenu = $('#drawerMenu');
	var $drawerMenuOverlay = $('#drawerMenuOverlay');
	var $btnDrawerMenuClose = $('#btnDrawerMenuClose');

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

},{"../valiable.js":24}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _valiable = require('../valiable.js');

var _valiable2 = _interopRequireDefault(_valiable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var menuFloating = function menuFloating() {
	var $window = $(window);
	var $body = $('body');
	var $header = $('#header');
	var $globalNav = $('#globalNav');
	var $cloneNav = $globalNav.clone(true);
	$body.append(['<div id="floatingMenu">', '<div class="btnfloatingMenuClose"><p><span><span></p></div>', '</div>'].join(''));
	$cloneNav.appendTo('#floatingMenu');
	$header.append('<div id="btnMenu02"><p><span class="icoMenu"><span class="icoMenuInner"></span></span></p></div>');
	var scrollY;
	var $floationgNav = $('#floatingMenu');
	var $floationgNavItem = $floationgNav.find('li');
	var length = $floationgNavItem.length;

	// 開く
	$('#btnMenu02').on('click', function () {
		scrollY = $window.scrollTop();
		_valiable2.default.isMenuShow = true;
		$floationgNav.removeClass('is-hide').addClass('is-show').find('a').removeAttr('style');
		$body.css({
			'position': 'fixed',
			'width': '100%',
			'top': '-' + scrollY + 'px'
		});
		getFloatingMenuHeight();
	});

	// 閉じる
	$('.btnfloatingMenuClose').on('click', function () {
		$body.removeAttr('style');
		$floationgNav.removeClass('is-show').addClass('is-hide');
		$('html, body').prop({ scrollTop: scrollY });
	});
	$window.on('resize', $.throttle(100, function () {
		getFloatingMenuHeight();
	}));

	// ナビの高さを調整
	function getFloatingMenuHeight() {
		var windowHeigth = $window.height();
		if (windowHeigth > $floationgNavItem.outerHeight() * length) {
			$floationgNav.find('a').css({
				'height': windowHeigth / length + 'px',
				'padding': 0,
				'lineHeight': windowHeigth / length + 'px'
			});
		}
	}
}; // フローティングメニュー
exports.default = menuFloating;

},{"../valiable.js":24}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _valiable = require('../valiable.js');

var _valiable2 = _interopRequireDefault(_valiable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var menuSlide = function menuSlide() {
	var $body = $('body');
	var $header = $('#header');
	var $globalNav = $('#globalNav');
	var headerHeight = $header.outerHeight();
	var $cloneNav = $globalNav.clone(true);
	$body.append('<div id="slideMenu"></div>');
	$cloneNav.appendTo('#slideMenu');
	$header.append('<div id="btnMenu"><p><span class="icoMenu"><span class="icoMenuInner"></span></span></p></div>');
	var $slideMenu = $('#slideMenu');
	var slideMenuHeight = $slideMenu.height();
	var scrollY;
	$slideMenu.css('top', headerHeight);
	hideSlideMenu();
	$('#btnMenu').on('click', function () {
		$(this).children().toggleClass('is-active');
		if ($slideMenu.hasClass('is-show')) {
			hideSlideMenu();
		} else {
			showSlideMenu();
			getSlideMenuHeight();
		}
	});
	$(window).on('resize', $.throttle(100, function () {
		getSlideMenuHeight();
	}));
	$globalNav.find('span').on('click', function () {
		alet('aa');
		getSlideMenuHeight();
	});

	// 開く
	function showSlideMenu() {
		scrollY = $(window).scrollTop();
		_valiable2.default.isMenuShow = true;
		$slideMenu.removeClass('is-hide').addClass('is-show').velocity('stop').velocity({ translateY: 0 }, { display: 'block' });
	}

	// 閉じる
	function hideSlideMenu() {
		$slideMenu.removeClass('is-show').addClass('is-hide').css('height', 'auto').velocity('stop').velocity({ translateY: '-100%' }, { display: 'none' });
		$body.removeAttr('style');
		$('html, body').prop({ scrollTop: scrollY });
	}

	// ナビの高さを調整
	function getSlideMenuHeight() {
		if (_valiable2.default.isMenuShow) {
			var windowHeigth = $(window).height();
			// ウィンドウの高さよりナビの高さが大きかったら
			if (slideMenuHeight > windowHeigth - headerHeight) {
				$slideMenu.css({
					'height': windowHeigth - headerHeight + 'px',
					'overflow-y': 'scroll',
					'-webkit-overflow-scrolling': 'touch'
				});
				$body.css({
					'position': 'fixed',
					'width': '100%',
					'top': '-' + scrollY + 'px'
				});
			}
			// ナビの高さよりウィンドウの高さが大きかったら
			else {
					$slideMenu.css({
						'height': 'auto'
					});
					$body.css({
						'position': 'static'
					});
				}
		}
	}
}; // スライドメニュー
exports.default = menuSlide;

},{"../valiable.js":24}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// ランドスケープからポートレートに変更
var onPortraitChange = function () {
	$(window).on('orientationchange', function () {
		if (Math.abs(window.orientation) != 90) {
			location.reload();
		}
	});
}();
exports.default = onPortraitChange;

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// PCとスマホで画像を変更
var replaceSrc = function replaceSrc(before, after) {
	var $replaceSrc = $('.js-replaceSrc');
	$replaceSrc.each(function () {
		$(this).attr('src', $(this).attr('src').replace(new RegExp('(.*)' + before + '.([a-zA-Z0-9]+)$'), '$1' + after + '.$2'));
	});
};
exports.default = replaceSrc;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// ロールオーバー
var rollover = function () {
	var postfix = '_on';
	$('img.js-rollover, input[type="image"].js-rollover').each(function () {
		var $self = $(this);
		var src = $self.attr('src');
		var src_on = src.substr(0, src.lastIndexOf('.')) + postfix + src.substring(src.lastIndexOf('.'));
		$('<img>').attr('src', src_on);
		$self.on({
			mouseenter: function mouseenter() {
				$self.attr('src', src_on);
			},
			mouseleave: function mouseleave() {
				$self.attr('src', src);
			}
		});
	});
}();
exports.default = rollover;

},{}],17:[function(require,module,exports){
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
				top = $(target).offset().top;
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

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _valiable = require('../valiable.js');

var _valiable2 = _interopRequireDefault(_valiable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scrollEffect = function () {
	var $window = $(window);
	var SHOW_POSITION = 200;
	return {
		common: function common() {
			// ページトップボタン表示
			var $btnPageTop = $('.m-btnPageTop');
			var startPosition = 0;
			$window.on('scroll.scrollEffectCommon', function () {
				var currentPostion = $(this).scrollTop();
				var scrollTop = $window.scrollTop();
				var documentHeight = $(document).height();
				var scrollPosition = $window.height() + scrollTop;
				// 下にスクロール
				if (currentPostion > startPosition) {
					// SHOW_POSITIONより下にスクロールしたら
					if ($window.scrollTop() > SHOW_POSITION) {
						$btnPageTop.removeClass('is-show');
					} else if (documentHeight === scrollPosition) {
						$btnPageTop.addClass('is-show');
					}
				}
				// 上にスクロール
				else {
						// SHOW_POSITIONより上にスクロールしたら
						if ($window.scrollTop() < SHOW_POSITION) {
							$btnPageTop.removeClass('is-show');
						}
						// 上にスクロール
						else {
								$btnPageTop.addClass('is-show');
							}
					}
				startPosition = currentPostion;
				// ページトップボタンを固定
				(function fixedPageTop() {
					var bottomY = 0;
					var height = $window.height();
					var scrollTop = $window.scrollTop();
					var documentHeight = $(document).height();
					var pageNavHeight = $('.m-pageNav').height();
					var bottomHeight = pageNavHeight + height + scrollTop + bottomY - documentHeight;
					if (scrollTop >= documentHeight - height - pageNavHeight + bottomY) {
						$btnPageTop.css({
							bottom: bottomHeight - bottomY
						});
					} else {
						$btnPageTop.css({
							bottom: bottomY
						});
					}
				})();
			});
		},
		pc: function pc() {
			var $h1 = $('.m-h1');
			var h1Height = $h1.outerHeight();
			var h1PaddingTop = parseInt($h1.css('padding-top'), 10);
			var h1Text = $h1.text();
			$('#main').prepend('<h1 class="cloneH1">' + h1Text + '</h1>');
			var $cloneH1 = $('.cloneH1');
			$window.on('scroll.scrollEffectPC', $.throttle(100, function () {
				if ($window.scrollTop() > h1PaddingTop) {
					$h1.addClass('is-hidden');
					$cloneH1.addClass('is-show');
				} else {
					$h1.removeClass('is-hidden');
					$cloneH1.removeClass('is-show');
				}
				if ($window.scrollTop() > h1Height) {
					$cloneH1.addClass('is-fixed');
				} else {
					$cloneH1.removeClass('is-fixed');
				}
			}));
		},
		sp: function sp() {
			var $header = $('#header');
			var startPosition = 0;
			$window.on('scroll.scrollEffectSP', $.throttle(100, function () {
				var currentPostion = $(this).scrollTop();
				// 下にスクロール
				if (currentPostion > startPosition && $window.scrollTop() >= SHOW_POSITION) {
					if (_valiable2.default.isMenuShow) {
						_valiable2.default.isMenuShow = false;
					} else {
						$header.removeClass('is-show').css({
							'top': '-' + $header.outerHeight() + 'px'
						});
					}
				}
				// 上にスクロール
				else {
						$header.addClass('is-show').removeAttr('style');
					}
				startPosition = currentPostion;
			}));
		}
	};
}(); // 上にスクロールで表示
exports.default = scrollEffect;

},{"../valiable.js":24}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// 表組みをスクロール（スマホ）
var scrollTable = function scrollTable() {
	var text = {
		open: '表を伸ばす',
		close: '表を縮める'
	};
	var $scrollTable = $('.js-scrollTable');
	var btnHtml = '<p class="m-table_btnScroll">' + text.open + '</p>';
	var wrapHtml = '<div class="m-table_outer"><div class="m-table_inner"></div></div>';

	$scrollTable.each(function () {
		if (!$(this).prev('.m-table_btnScroll').length) {
			$(this).before(btnHtml);
		}
		$(this).prev('.m-table_btnScroll').on('click', function () {
			if ($(this).next().find($scrollTable).hasClass('is-scroll')) {
				$(this).next().find($scrollTable).removeClass('is-scroll').unwrap().unwrap();
				$(this).text(text.open);
			} else {
				$(this).next($scrollTable).addClass('is-scroll').wrap(wrapHtml);
				$(this).text(text.close);
			}
		});
	});
};
exports.default = scrollTable;

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// タブコンテンツ
var tab = function () {
	var $tab = $('.js-tab');
	$tab.each(function () {
		var $self = $(this);
		var $tabBtn = $self.find('.js-tab_btn');
		var $tabBody = $self.find('.js-tab_body');
		$tabBtn.eq(0).addClass('is-active');
		$tabBody.hide().eq(0).show();
		$tabBtn.on('click', function () {
			var num = $tabBtn.index(this);
			$tabBtn.removeClass('is-active');
			$(this).addClass('is-active');
			$tabBody.hide().eq(num).show();
			return false;
		});
	});
}();
exports.default = tab;

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _replase_src = require('./module/replase_src.js');

var _replase_src2 = _interopRequireDefault(_replase_src);

var _scroll_effect = require('./module/scroll_effect.js');

var _scroll_effect2 = _interopRequireDefault(_scroll_effect);

var _menu_drawer = require('./module/menu_drawer.js');

var _menu_drawer2 = _interopRequireDefault(_menu_drawer);

var _menu_floating = require('./module/menu_floating.js');

var _menu_floating2 = _interopRequireDefault(_menu_floating);

var _menu_slide = require('./module/menu_slide.js');

var _menu_slide2 = _interopRequireDefault(_menu_slide);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onMediaQuery = function () {
	var $window = $(window);
	var $body = $('body');
	var $header = $('#header');
	var $main = $('#main');
	var breadcrumbsScroll = void 0;
	var queries = [{
		context: ['pc', 'minipc'],
		match: function match() {
			_scroll_effect2.default.common();
			_scroll_effect2.default.pc();
		},
		unmatch: function unmatch() {
			$window.off('scroll.scrollEffectPC');
			$('.m-h1').removeClass('is-hidden');
			$('.cloneH1').remove();
		}
	}, {
		context: ['tablet', 'phablet', 'sp'],
		match: function match() {
			_scroll_effect2.default.common();
			_scroll_effect2.default.sp();
			(0, _menu_drawer2.default)();
			(0, _menu_floating2.default)();
			(0, _menu_slide2.default)();
			$main.css('padding-top', $header.height());
			$(window).on('load', function () {
				$main.css('padding-top', $header.height());
			});
		},
		unmatch: function unmatch() {
			$(window).off('scroll.scrollEffectSP');
			$body.removeAttr('style');
			$header.removeClass();
			$header.removeAttr('style');
			$main.removeAttr('style');
			$('#btnMenu').remove();
			$('#btnMenu02').remove();
			$('#btnMenu03').remove();
			$('#btnMenu04').remove();
			$('#slideMenu').remove();
			$('#floatingMenu').remove();
			$('#drawerMenu').remove();
			$('#drawerMenuOverlay').remove();
			$('#btnDrawerMenuClose').remove();
			$('#drawerMenu02').remove();
		}
	}, {
		context: ['phablet', 'sp'],
		match: function match() {
			(0, _replase_src2.default)('_pc', '_sp');
		},
		unmatch: function unmatch() {
			(0, _replase_src2.default)('_sp', '_pc');
		}
	}];
	MQ.init(queries);
}(); // メディアクエリでjsを切り替え
exports.default = onMediaQuery;

},{"./module/menu_drawer.js":10,"./module/menu_floating.js":11,"./module/menu_slide.js":12,"./module/replase_src.js":15,"./module/scroll_effect.js":18}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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
