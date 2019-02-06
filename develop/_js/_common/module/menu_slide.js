// スライドメニュー
import valiable from '../valiable.js';

let menuSlide = function() {
	var $body        = $('body');
	var $header      = $('#header');
	var $globalNav   = $('#globalNav');
	var headerHeight = $header.outerHeight();
	var $cloneNav    = $globalNav.clone(true);
	$body.append('<div id="slideMenu"></div>');
	$cloneNav.appendTo('#slideMenu');
	$header.append('<div id="btnMenu"><p><span class="icoMenu"><span class="icoMenuInner"></span></span></p></div>');
	var $slideMenu = $('#slideMenu');
	var slideMenuHeight = $slideMenu.height();
	var scrollY;
	$slideMenu.css('top', headerHeight);
	hideSlideMenu();
	$('#btnMenu').on('click', function() {
		$(this).children().toggleClass('is-active');
		if ($slideMenu.hasClass('is-show')) {
			hideSlideMenu();
		} else {
			showSlideMenu();
			getSlideMenuHeight();
		}
	});
	$(window).on('resize', $.throttle(100, function() {
		getSlideMenuHeight();
	}));
	$globalNav.find('span').on('click', function(){
		alet('aa');
		getSlideMenuHeight();
	});

	// 開く
	function showSlideMenu() {
		scrollY = $(window).scrollTop();
		valiable.isMenuShow = true;
		$slideMenu.removeClass('is-hide').addClass('is-show').velocity('stop').velocity({translateY:0},{display:'block'});
	}

	// 閉じる
	function hideSlideMenu() {
		$slideMenu.removeClass('is-show').addClass('is-hide').css('height', 'auto').velocity('stop').velocity({translateY:'-100%'},{display:'none'});
		$body.removeAttr('style');
		$('html, body').prop({scrollTop: scrollY});
	}

	// ナビの高さを調整
	function getSlideMenuHeight() {
		if (valiable.isMenuShow) {
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
}
export default menuSlide;