// ブロック要素の高さを行ごとに揃える
let matchHeight = (function() {
	$(window).on('load', function() {
		$('.js-matchHeight').matchHeight();
	});
}());
export default matchHeight;