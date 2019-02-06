// カスタムデータ属性にウィンドウネーム、横幅、縦幅を指定可能（省略可）。
// HTML記述サンプル
// <a href="#" class="js-popup" data-name="popup" data-width="800" data-height="500">ポップアップ</a>
// <a href="#" class="js-popup">ポップアップ</a>
var popup = (function() {
	var $popup = $('.js-popup');
	$popup.each(function() {
		var $self = $(this);
		$self.on('click', function() {
			var url = $(this).attr('href');
			var windowName = $(this).data('name');
			var width = $(this).data('width');
			var height = $(this).data('height');
			if (!windowName) windowName = 'popup';
			if (!width) var width = window.innerWidth || document.documentElement.clientWidth;
			if (!height) var height = window.innerHeight || document.documentElement.clientHeight;
			var option = 'menubar=no, titlebar=no, toolbar=no, location=no, status=no, scrollbars=yes, resizable=no';
			var x = (screen.availWidth - width) / 2;
			var y = (screen.availHeight - height) / 2;
			var o = option+', width=' + width + ', height=' + height + ', left=' + x + ', top=' + y;
			var blockMessage = 'ウィンドウがお使いのブラウザでポップアップブロックされました\nポップアップブロックを解除してください';
			var win = window.open(url, windowName, o);
			if (win) {
				win.focus();
			} else {
				alert(blockMessage);
			}
			return false;
		});
	});
}());
export default popup;