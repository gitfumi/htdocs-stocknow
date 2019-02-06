// モバイル端末以外はtelリンクを無効
import ua from '../ua.js';
let disableTelLink = (function() {
	if (!ua.Mobile) {
		$('a[href^="tel:"]').on('click', function(e) {
			e.preventDefault();
		});
	}
}());
export default disableTelLink;