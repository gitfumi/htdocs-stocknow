// グローバルナビゲーションの表示、非表示
let globalNav = (function() {
	if ($('#globalNav').length) {
		let $globalNav = $('#globalNav');
		let $cat       = $globalNav.find('span');
		let currentCat = '.is-' + $('body').attr('class').replace('p-', '');
		$globalNav.find(currentCat).addClass('is-show').children('ul').show();
		$cat.on('click', function() {
			let $self   = $(this);
			let $target = $self.parent().children('ul');
			if ($target.is(':visible')) {
				$target.slideUp();
				$self.parent().removeClass('is-show');
			} else {
				$target.slideDown();
				$self.parent().addClass('is-show');
			}
		});
	}
}());
export default globalNav;
