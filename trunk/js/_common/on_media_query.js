// メディアクエリでjsを切り替え
// import replaceSrc    from './module/replase_src.js';
// import scrollEffect  from './module/scroll_effect.js';
import menuDrawer    from './module/menu_drawer.js';
// import menuFloating  from './module/menu_floating.js';
// import menuSlide     from './module/menu_slide.js';
let onMediaQuery = (function() {
	let $window = $(window);
	let $body   = $('body');
	let $header = $('#header');
	// let $main   = $('#main');
	let breadcrumbsScroll;
	let queries = [
		{
			context: ['pc', 'minipc'],
			match: function() {
				// scrollEffect.common();
				// scrollEffect.pc();
			},
			unmatch: function() {
				// $window.off('scroll.scrollEffectPC');
				// $('.m-h1').removeClass('is-hidden');
				// $('.cloneH1').remove();
			}
		},
		{
			context: ['tablet', 'phablet', 'sp'],
			match: function() {
				menuDrawer();
				// scrollEffect.common();
				// scrollEffect.sp();
				// menuFloating();
				// menuSlide();
				// $main.css('padding-top', $header.height());
				// $(window).on('load', function() {
				// 	$main.css('padding-top', $header.height());
				// });
			},
			unmatch: function() {
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
		},
		{
			context: ['phablet', 'sp'],
			match: function() {
				// replaceSrc('_pc', '_sp');
			},
			unmatch: function() {
				// replaceSrc('_sp', '_pc');
			}
		}
	];
	MQ.init(queries);
}());
export default onMediaQuery;