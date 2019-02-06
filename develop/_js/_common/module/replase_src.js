// PCとスマホで画像を変更
let replaceSrc = function(before, after) {
	let $replaceSrc = $('.js-replaceSrc');
	$replaceSrc.each(function() {
		$(this).attr('src', $(this).attr('src').replace(new RegExp(`(.*)${before}.([a-zA-Z0-9]+)$`), `$1${after}.$2`));
	});
}
export default replaceSrc;