// スライドメニュー
import valiable from '../valiable.js';

let menuSlide = function() {
	var $body         = $('body');
	var $header       = $('.header_logo');
	var $headerNav       = $('.header_inner');
	var $contents       = $('#contents');
	// var $globalNav    = $('.footer_menu nav');
	// var $globalSuvNav = $('.header_subMenu');
	// var $asideSns     = $('.asideMenu .c-sns');
	var headerHeight  = $header.outerHeight();
	// var $cloneNav     = $globalNav.clone(true);
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
	$('#btnMenu').on('click', function() {
		$(this).children().toggleClass('is-active');
		if ($headerNav.hasClass('is-show')) {
			hideSlideMenu();
		} else {
			showSlideMenu();
		}
	});

	// 開く
	function showSlideMenu() {
		scrollY = $(window).scrollTop();
		valiable.isMenuShow = true;
		$headerNav.removeClass('is-hide').addClass('is-show');
		$contents.removeClass('is-hide').addClass('is-show');
	}

	// 閉じる
	function hideSlideMenu() {
		$headerNav.removeClass('is-show').addClass('is-hide');
		$contents.removeClass('is-show').addClass('is-hide');
		$body.removeAttr('style');
		$('html, body').prop({scrollTop: scrollY});
	}
}
export default menuSlide;