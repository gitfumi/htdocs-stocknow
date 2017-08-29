// 指定のアンカー要素までスクロール
let scrollAnchor = (function() {
	let $win              = $(window);
	let $doc              = $(document);
	let $scrollElement    = getFirstScrollable('html,body');
	let mousewheel        = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	const SCROLL_SPEED    = 800;
	const SCROLL_EASING   = 'easeOutQuint';
	const NO_SCROLL_CLASS = 'js-noScroll';
	const PAGE_TOP_HASH   = '#top';
	// aタグのクリック
	$doc.on('click', 'a[href^="#"]', function(e) {
		let $self = $(this);
		let target = this.hash;
		let top;
		// リンク先が#topの場合
		if (target == PAGE_TOP_HASH) {
			// ページの先頭へスクロール
			top = 0;
		}
		// リンク先が#topではない場合
		else {
			// 指定した要素が存在しない場合、a要素にclass（js-noScroll）を指定してた場合は未処理とする
			if ($(target).length < 1 || $self.hasClass(NO_SCROLL_CLASS)) return false;
			// スクロール先の座標を調整する
			top = $(target).offset().top;
			top = Math.min(top, $doc.height() - $win.height());
		}
		// ウィールイベントをキャンセルしておく
		$doc.on(mousewheel, function(e) { e.preventDefault(); });
		// アニメーションの実行
		$scrollElement.stop().animate({scrollTop: top}, SCROLL_SPEED, SCROLL_EASING, function() {
			$doc.off(mousewheel);
		});
		return false;
	});
	// htmlとbody、どちらかスクロール可能な要素を取得
	function getFirstScrollable(selector) {
		let $scrollable;
		$(selector).each(function() {
			let $self = $(this);
			if ( $self.scrollTop() > 0 ) {
				$scrollable = $self;
				return false;
			} else {
				$self.scrollTop(1);
				if ( $self.scrollTop() > 0 ) {
					$scrollable = $self;
					return false;
				}
				$self.scrollTop(0);
			}
		});
		return $scrollable;
	}
}());
export default scrollAnchor;