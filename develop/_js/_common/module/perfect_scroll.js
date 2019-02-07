// グローバルナビゲーションの表示、非表示
let perfectScrollbar = (function() {
	if ($('#js-perfectScrollbar').length) {
		console.log('hhhh');
		var ps = new PerfectScrollbar('#js-perfectScrollbar');
	}
}());
export default perfectScrollbar;
