// ドロワーメニュー
import valiable from '../valiable.js';

let menuDrawer = function() {
	var $window      = $window;
	var $body        = $('body');
	var $header      = $('#header');
	var $globalNav   = $('#globalNav');
	var $cloneNav    = $globalNav.clone(true);
	$body.append([
		'<div id="drawerMenu"></div>',
		'<div id="drawerMenuOverlay"></div>',
		'<div id="btnDrawerMenuClose"><p><span><span></p></div>'
	].join(''));
	$cloneNav.appendTo('#drawerMenu');
	$header.append('<div id="btnMenu03"><p><span class="icoMenu"><span class="icoMenuInner"></span></span></p></div>');
	var scrollY;
	var $drawerMenu = $('#drawerMenu');
	var $drawerMenuOverlay = $('#drawerMenuOverlay');
	var $btnDrawerMenuClose = $('#btnDrawerMenuClose');

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