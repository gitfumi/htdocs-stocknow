// 上にスクロールで表示
import valiable from '../valiable.js';

let scrollEffect = (function() {
	let $window          = $(window);
	const SHOW_POSITION  = 200;
	return {
		common: function() {
			// ページトップボタン表示
			let $btnPageTop    = $('.m-btnPageTop');
			let startPosition  = 0;
			$window.on('scroll.scrollEffectCommon', function() {
				let currentPostion = $(this).scrollTop();
				let scrollTop      = $window.scrollTop();
				let documentHeight = $(document).height();
				let scrollPosition = $window.height() + scrollTop;
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
					let bottomY        = 0;
					let height         = $window.height();
					let scrollTop      = $window.scrollTop();
					let documentHeight = $(document).height();
					let pageNavHeight  = $('.m-pageNav').height();
					let bottomHeight   = pageNavHeight + height + scrollTop + bottomY - documentHeight;
					if (scrollTop >= documentHeight - height - pageNavHeight + bottomY) {
						$btnPageTop.css({
							bottom: bottomHeight - bottomY
						});
					} else {
						$btnPageTop.css({
							bottom: bottomY
						});
					}
				}());
			});
		},
		pc: function() {
			let $h1          = $('.m-h1');
			let h1Height     = $h1.outerHeight();
			let h1PaddingTop = parseInt($h1.css('padding-top'), 10);
			let h1Text       = $h1.text();
			$('#main').prepend(`<h1 class="cloneH1">${h1Text}</h1>`);
			let $cloneH1     = $('.cloneH1');
			$window.on('scroll.scrollEffectPC', $.throttle(100, function() {
				if ($window.scrollTop() > h1PaddingTop ) {
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
		sp: function() {
			let $header          = $('#header');
			let startPosition    = 0;
			$window.on('scroll.scrollEffectSP', $.throttle(100, function() {
				let currentPostion = $(this).scrollTop();
				// 下にスクロール
				if (currentPostion > startPosition && $window.scrollTop() >= SHOW_POSITION) {
					if (valiable.isMenuShow) {
						valiable.isMenuShow = false;
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
	}
}());
export default scrollEffect;