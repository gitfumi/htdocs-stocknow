// フローティングメニュー
import valiable from '../valiable.js';

let menuFloating = function() {
	var $window    = $(window);
	var $body      = $('body');
	var $header    = $('#header');
	var $globalNav = $('#globalNav');
	var $cloneNav  = $globalNav.clone(true);
	$body.append([
		'<div id="floatingMenu">',
			'<div class="btnfloatingMenuClose"><p><span><span></p></div>',
		'</div>'
	].join(''));
	$cloneNav.appendTo('#floatingMenu');
	$header.append('<div id="btnMenu02"><p><span class="icoMenu"><span class="icoMenuInner"></span></span></p></div>');
	var scrollY;
	var $floationgNav     = $('#floatingMenu');
	var $floationgNavItem = $floationgNav.find('li');
	var length            = $floationgNavItem.length;

	// 開く
	$('#btnMenu02').on('click', function() {
		scrollY = $window.scrollTop();
		valiable.isMenuShow = true;
		$floationgNav.removeClass('is-hide').addClass('is-show').find('a').removeAttr('style');
		$body.css({
			'position': 'fixed',
			'width': '100%',
			'top': '-' + scrollY + 'px'
		});
		getFloatingMenuHeight();
	});

	// 閉じる
	$('.btnfloatingMenuClose').on('click', function() {
		$body.removeAttr('style');
		$floationgNav.removeClass('is-show').addClass('is-hide');
		$('html, body').prop({scrollTop: scrollY});
	});
	$window.on('resize', $.throttle(100, function() {
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
}
export default menuFloating;