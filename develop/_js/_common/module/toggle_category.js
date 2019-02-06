// コンテンツの表示、非表示
let toggoleCategory = (function() {
	let $togglePoint= $('.js-toggleCat_p');
	let $toggleTarget= $('.js-toggleCat_t');
	let $closeBtn= $('.js-toggleClose');
	const SLIDE_DOWN_SPEED = 300;
	const SLIDE_UP_SPEED   = 300;

	// 現在ページだったら開く
	if ($togglePoint.hasClass('is-current')) {
		$togglePoint.addClass('is-show');
	}
	// 現在ページじゃなければ閉じる
	else {
		$togglePoint.addClass('is-hide');
		$toggleTarget.hide();
	}

	$togglePoint.on('click', function() {
		let $self              = $(this);
		// 開いていたら
		if ($self.hasClass('is-show')) {
			$self.removeClass('is-show is-current').addClass('is-hide');
			$toggleTarget.not(':animated').slideUp(SLIDE_UP_SPEED);
		}
		// 閉じていたら
		else {
			$self.removeClass('is-hide').addClass('is-show');
			$toggleTarget.not(':animated').slideDown(SLIDE_DOWN_SPEED);
		}
	});
	$closeBtn.on('click', function(){
		let $self              = $togglePoint;
		$self.removeClass('is-show is-current').addClass('is-hide');
		$toggleTarget.not(':animated').slideUp(SLIDE_UP_SPEED);
	});
}());
export default toggoleCategory;