// 上にスクロールで表示

let scrollHeaderEffect = (function() {
	let $window         = $(window);
	let $header         = $('#header');
	let headerHeight    = $header.height();
	var scrollPosi      = $window.scrollTop();
	const SHOW_POSITION = 200;
	judgment(scrollPosi);

	$window.on('scroll.scrollEffectCommon', function() {
		let currentPostion = $(this).scrollTop();
		judgment(currentPostion);
	});
	function judgment(currentPostion){
		if(currentPostion > headerHeight){
			$header.addClass('is-short');
		}else{
			$header.removeClass('is-short');
		}
	}
}());
export default scrollHeaderEffect;