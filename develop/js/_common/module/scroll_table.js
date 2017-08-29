// 表組みをスクロール（スマホ）
let scrollTable = function() {
	const text = {
		open: '表を伸ばす',
		close: '表を縮める'
	}
	let $scrollTable = $('.js-scrollTable');
	let btnHtml = '<p class="m-table_btnScroll">' + text.open + '</p>';
	let wrapHtml = '<div class="m-table_outer"><div class="m-table_inner"></div></div>';

	$scrollTable.each(function() {
		if (!$(this).prev('.m-table_btnScroll').length) {
			$(this).before(btnHtml);
		}
		$(this).prev('.m-table_btnScroll').on('click', function() {
			if ($(this).next().find($scrollTable).hasClass('is-scroll')) {
				$(this).next().find($scrollTable).removeClass('is-scroll').unwrap().unwrap();
				$(this).text(text.open);
			} else {
				$(this).next($scrollTable).addClass('is-scroll').wrap(wrapHtml);
				$(this).text(text.close);
			}
		});
	});
};
export default scrollTable;