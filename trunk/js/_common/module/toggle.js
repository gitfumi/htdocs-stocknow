// コンテンツの表示、非表示
let toggle = (function() {
	let $toggleBtn = $('.js-toggle_btn');
	$toggleBtn.each(function() {
		let $self              = $(this);
		let $toggleBody        = $self.next();
		const SLIDE_DOWN_SPEED = 300;
		const SLIDE_UP_SPEED   = 300;
		// 現在ページだったら開く
		if ($self.hasClass('is-current')) {
			$self.addClass('is-show');
		}
		// 現在ページじゃなければ閉じる
		else {
			$self.addClass('is-hide');
			$toggleBody.hide();
		}
		$self.on('click', function() {
			// 開いていたら
			if ($self.hasClass('is-show')) {
				$self.removeClass('is-show is-current').addClass('is-hide');
				$toggleBody.not(':animated').slideUp(SLIDE_UP_SPEED);
			}
			// 閉じていたら
			else {
				$self.removeClass('is-hide').addClass('is-show');
				$toggleBody.not(':animated').slideDown(SLIDE_DOWN_SPEED);
			}
		});
	});
}());
export default toggle;