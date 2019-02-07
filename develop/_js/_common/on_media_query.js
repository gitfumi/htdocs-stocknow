// メディアクエリでjsを切り替え
// import menuDrawer    from './module/menu_drawer.js';

let onMediaQuery = (function() {
	let $window = $(window);
	let $body   = $('body');
	let $header = $('#header');
	let breadcrumbsScroll;
	let queries = [
		{
			context: ['pc', 'minipc'],
			match: function() {
			},
			unmatch: function() {
			}
		},
		{
			context: ['tablet', 'phablet', 'sp'],
			match: function() {
				// menuDrawer();
			},
			unmatch: function() {
				$(window).off('scroll.scrollEffectSP');
				$body.removeAttr('style');
				$('#btnMenu03').remove();
				$('#drawerMenu').remove();
				$('#drawerMenuOverlay').remove();
				$('#btnDrawerMenuClose').remove();
			}
		},
		{
			context: ['phablet', 'sp'],
			match: function() {
			},
			unmatch: function() {
			}
		}
	];
	MQ.init(queries);
}());
export default onMediaQuery;