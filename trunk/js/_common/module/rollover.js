// ロールオーバー
let rollover = (function() {
	let postfix = '_on';
	$('img.js-rollover, input[type="image"].js-rollover').each(function() {
		let $self  = $(this);
		let src    = $self.attr('src');
		let src_on = src.substr(0, src.lastIndexOf('.')) + postfix + src.substring(src.lastIndexOf('.'));
		$('<img>').attr('src', src_on);
		$self.on({
			mouseenter: function() {
				$self.attr('src', src_on);
			},
			mouseleave: function() {
				$self.attr('src', src);
			}
		});
	});
}());
export default rollover;