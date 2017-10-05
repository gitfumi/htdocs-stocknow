// ドロワーメニュー
import valiable from '../valiable.js';

let menuDrawer = function() {
	var $window      = $window;
	var $body        = $('body');
	var $header      = $('#header');
	var $globalNav   = $('#headerNav');
	var $globalCat   = $('#headerCat');
	var $globalSub   = $('#headerSub');
	var $cloneGNav    = $globalNav.clone(true);
	var $cloneCNav    = $globalCat.clone(true);
	var $cloneSNav    = $globalSub.clone(true);
	$body.append([
		'<div id="drawerMenu"><div id="drawerMenuInner"></div></div>',
		'<div id="drawerMenuOverlay"></div>',
		'<div id="btnDrawerMenuClose"><p><span><span></p></div>'
	].join(''));
	$cloneGNav.appendTo('#drawerMenuInner').attr('id','drawerNav').find('.navLogo').remove();
	$header.append('<div id="btnMenu03"><p><span class="icoMenu"><span class="icoMenuInner"></span></span></p></div>');
	var scrollY;
	var $drawerMenu = $('#drawerMenu');
	var $drawerMenuInner = $('#drawerMenuInner');
	var $drawerMenuOverlay = $('#drawerMenuOverlay');
	var $btnDrawerMenuClose = $('#btnDrawerMenuClose');

	// 「Menu」テキストの追加
	$drawerMenuInner.prepend('<p id="drawerTtl">MENU</p>');

	// 「category」の追加
	$cloneCNav.appendTo($drawerMenuInner).attr('id','drawerCat').removeClass('js-toggleCat_t').show();
	// 「Sub Menu」の追加
	$cloneSNav.appendTo($drawerMenuInner).attr('id','drawerSub');

	// 開く
	$('#btnMenu03').on('click', function() {
		scrollY = $(window).scrollTop();
		valiable.isMenuShow = true;
		$body.css({
			'position': 'fixed',
			'top'     : '-' + scrollY + 'px',
			'left'    : 0,
			'width'   : '100%'
		});
		$drawerMenu.removeClass('is-hide').addClass('is-show');
		$drawerMenuOverlay.addClass('is-show');
		$btnDrawerMenuClose.addClass('is-show');
	});

	// 閉じる
	$('#drawerMenuOverlay, #btnDrawerMenuClose').on('click', function() {
		$body.removeAttr('style');
		$drawerMenu.removeClass('is-show').addClass('is-hide');
		$drawerMenuOverlay.removeClass('is-show');
		$btnDrawerMenuClose.removeClass('is-show');
		$('html, body').prop({scrollTop: scrollY});
	});
}
export default menuDrawer;