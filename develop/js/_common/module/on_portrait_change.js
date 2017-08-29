// ランドスケープからポートレートに変更
let onPortraitChange = (function() {
	$(window).on('orientationchange', function() {
		if (Math.abs(window.orientation) != 90) {
			location.reload();
		}
	});
}());
export default onPortraitChange;