// ボックス全体をリンク
let boxLink = (function() {
	let $boxLink = $('.js-boxLink');
	$boxLink.each(function() {
		let $self = $(this);
		$self.css('cursor', 'pointer').on({
			mouseenter: function() {
				$self.addClass('is-hover');
			},
			mouseleave: function() {
				$self.removeClass('is-hover');
			}
		});
		$self.on('click', function() {
			let url = $self.find('a').attr('href');
			$self.addClass('is-hover');
			if ($(this).find('a').attr('target') === '_blank') {
				window.open(url);
			} else {
				window.location = url;
			}
			return false;
		});
	});
}());
export default boxLink;