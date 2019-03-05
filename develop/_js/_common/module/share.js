// グローバルナビゲーションの表示、非表示
let share = (function() {
	let pathname = location.pathname; // URLを取得しエンコードする
	let snsUrl = encodeURIComponent('https://stocknow.info' + pathname);
	$('.js-share li').each(function() {
		let $a = $(this).find('a')
		let link = $a.attr('href')
		$a.attr('href',link + snsUrl)
	});
}());
export default share;
