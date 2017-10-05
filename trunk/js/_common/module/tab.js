// タブコンテンツ
let tab = (function() {
	let $tab = $('.js-tab');
	$tab.each(function() {
		let $self    = $(this);
		let $tabBtn  = $self.find('.js-tab_btn');
		let $tabBody = $self.find('.js-tab_body');
		$tabBtn.eq(0).addClass('is-active');
		$tabBody.hide().eq(0).show();
		$tabBtn.on('click', function() {
			let num = $tabBtn.index(this);
			$tabBtn.removeClass('is-active');
			$(this).addClass('is-active');
			$tabBody.hide().eq(num).show();
			return false;
		});
	});
}());
export default tab;