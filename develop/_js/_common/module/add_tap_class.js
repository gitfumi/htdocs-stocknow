// タッチデバイスで:hoverを再現
let addTapClass = (function() {
	$(document).on(window.ontouchstart === null ? 'touchstart' : 'mouseenter', 'a, button, .js-hover', function() {
		$(this).addClass('is-hover');
	}).on(window.ontouchend === null ? 'touchend' : 'mouseleave', 'a, button, .js-hover', function() {
		let self = this;
		setTimeout(function() {
			$(self).removeClass('is-hover');
		}, 100);
	});
}());
export default addTapClass;
