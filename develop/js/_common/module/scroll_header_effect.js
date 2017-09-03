// 上にスクロールで表示

let scrollHeaderEffect = (function() {
	let $window         = $(window);
	let $header         = $('#header');
	let headerHeight    = $header.height();
	const SHOW_POSITION = 200;

	$window.on('scroll.scrollEffectCommon', function() {
		let currentPostion = $(this).scrollTop();

		if(currentPostion > headerHeight){
			$header.addClass('is-short');
		}else{
			$header.removeClass('is-short');
		}
	});
}());
export default scrollHeaderEffect;